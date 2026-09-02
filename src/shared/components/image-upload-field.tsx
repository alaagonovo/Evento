"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { Camera, ImagePlus, Images, Play, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { UploadFolder } from "@/shared/lib/cloudinary";
import {
  countImageUrls,
  countVideoUrls,
  isImageFile,
  isVideoFile,
  isVideoUrl,
} from "@/shared/lib/media";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/shared/lib/upload-limits";
import { deleteCloudinaryImage, uploadLocalFile } from "@/shared/lib/upload-image";

type ImageUploadFieldProps = {
  id: string;
  folder: UploadFolder;
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  maxVideos?: number;
  disabled?: boolean;
  chooseLabel: string;
  changeLabel: string;
  uploadingLabel: string;
  removeLabel: string;
  failedLabel: string;
  tooLargeLabel: string;
  tooManyLabel: string;
  tooLargeVideoLabel?: string;
  tooManyVideosLabel?: string;
  hint?: string;
  countLabel?: string;
  percentLabel?: string;
  onBusy?: (busy: boolean) => void;
};

type ErrorKind = "size" | "count" | "video-size" | "video-count" | "upload" | null;

type PendingUpload = {
  id: string;
  preview: string;
  percent: number;
  kind: "image" | "video";
};

function UploadProgress({
  percent,
  percentText,
  label,
  compact = false,
}: {
  percent: number;
  percentText: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex flex-col items-center", compact ? "gap-1" : "gap-2")}>
      <span className={cn("font-heading tabular-nums text-gold", compact ? "text-sm" : "text-xl")}>
        {percentText}
      </span>
      <span
        className={cn(
          "block overflow-hidden rounded-full bg-gold/20",
          compact ? "h-1 w-14" : "h-1.5 w-28",
        )}
      >
        <span
          className="block h-full rounded-full bg-gold transition-[width] duration-150"
          style={{ width: `${percent}%` }}
        />
      </span>
      {compact ? null : <span className="text-xs text-muted-foreground">{label}</span>}
    </span>
  );
}

function MediaPreview({ src, video }: { src: string; video: boolean }) {
  if (video) {
    return (
      <>
        <video src={src} className="size-full object-cover" muted playsInline preload="metadata" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-secondary/25">
          <Play className="size-5 fill-current text-secondary-foreground" aria-hidden />
        </span>
      </>
    );
  }

  if (src.startsWith("blob:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
      <img src={src} alt="" className="size-full object-cover" />
    );
  }

  return <Image src={src} alt="" fill className="object-cover" sizes="140px" />;
}

export function ImageUploadField({
  id,
  folder,
  value,
  onChange,
  maxFiles = 1,
  maxVideos = 0,
  disabled = false,
  chooseLabel,
  changeLabel,
  uploadingLabel,
  removeLabel,
  failedLabel,
  tooLargeLabel,
  tooManyLabel,
  tooLargeVideoLabel,
  tooManyVideosLabel,
  hint,
  countLabel,
  percentLabel = "{percent}%",
  onBusy,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [error, setError] = useState<ErrorKind>(null);
  const [dragOver, setDragOver] = useState(false);
  const isCover = maxFiles === 1 && maxVideos === 0;
  const galleryBusy = pendingUploads.length > 0;
  const busy = isCover ? pending : galleryBusy;
  const remainingImages = Math.max(
    0,
    maxFiles - countImageUrls(value) - pendingUploads.filter((item) => item.kind === "image").length,
  );
  const remainingVideos = Math.max(
    0,
    maxVideos - countVideoUrls(value) - pendingUploads.filter((item) => item.kind === "video").length,
  );
  const remaining = remainingImages + remainingVideos;
  const canAdd = remaining > 0 && !disabled && !busy;
  const inputEnabled = !disabled && !busy && (isCover || canAdd);
  const acceptTypes = isCover
    ? ALLOWED_IMAGE_TYPES.join(",")
    : [...ALLOWED_IMAGE_TYPES, ...(maxVideos > 0 ? ALLOWED_VIDEO_TYPES : [])].join(",");

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (!files.length) return;

    if (isCover) {
      const oversized = files.filter((file) => file.size > MAX_IMAGE_BYTES);
      const allowed = files.filter((file) => isImageFile(file) && file.size <= MAX_IMAGE_BYTES);
      setError(oversized.length > 0 ? "size" : null);
      const file = allowed[0];
      if (!file) return;

      const previousCover = value[0];
      setPending(true);
      setProgress(0);
      onBusy?.(true);
      try {
        const url = await uploadLocalFile(file, folder, setProgress);
        setProgress(100);
        onChange([url]);
        if (previousCover && previousCover !== url) {
          void deleteCloudinaryImage(previousCover);
        }
      } catch {
        setError("upload");
      } finally {
        setPending(false);
        onBusy?.(false);
        if (inputRef.current) inputRef.current.value = "";
      }
      return;
    }

    const images = files.filter(isImageFile);
    const videos = files.filter(isVideoFile);
    const okImages = images.filter((file) => file.size <= MAX_IMAGE_BYTES);
    const okVideos = videos.filter((file) => file.size <= MAX_VIDEO_BYTES);
    const selectedImages = okImages.slice(0, remainingImages);
    const selectedVideos = okVideos.slice(0, remainingVideos);
    const selected = [...selectedImages, ...selectedVideos];

    if (videos.some((file) => file.size > MAX_VIDEO_BYTES)) {
      setError("video-size");
    } else if (images.some((file) => file.size > MAX_IMAGE_BYTES)) {
      setError("size");
    } else if (okVideos.length > remainingVideos) {
      setError("video-count");
    } else if (okImages.length > remainingImages) {
      setError("count");
    } else {
      setError(null);
    }

    if (!selected.length) return;

    const batch = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      percent: 0,
      kind: (isVideoFile(file) ? "video" : "image") as "image" | "video",
    }));
    const existing = value;
    setPendingUploads(
      batch.map(({ id, preview, percent, kind }) => ({ id, preview, percent, kind })),
    );
    onBusy?.(true);

    try {
      const results = await Promise.allSettled(
        batch.map((item) =>
          uploadLocalFile(item.file, folder, (filePercent) => {
            setPendingUploads((current) =>
              current.map((upload) =>
                upload.id === item.id ? { ...upload, percent: filePercent } : upload,
              ),
            );
          }),
        ),
      );
      const uploaded = results.flatMap((result) =>
        result.status === "fulfilled" ? [result.value] : [],
      );
      if (uploaded.length) {
        onChange([...existing, ...uploaded]);
      }
      if (results.some((result) => result.status === "rejected")) {
        setError("upload");
      }
    } finally {
      batch.forEach((item) => URL.revokeObjectURL(item.preview));
      setPendingUploads([]);
      onBusy?.(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    const url = value[index];
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
    setError(null);
    if (url) void deleteCloudinaryImage(url);
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    if (inputEnabled) setDragOver(true);
  }

  function onDragLeave() {
    setDragOver(false);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragOver(false);
    if (inputEnabled) void handleFiles(event.dataTransfer.files);
  }

  const errorMessage =
    error === "size"
      ? tooLargeLabel
      : error === "count"
        ? tooManyLabel
        : error === "video-size"
          ? (tooLargeVideoLabel ?? tooLargeLabel)
          : error === "video-count"
            ? (tooManyVideosLabel ?? tooManyLabel)
            : error === "upload"
              ? failedLabel
              : null;

  const filledCount = countLabel
    ?.replace("{count}", String(value.length + pendingUploads.length))
    .replace("{max}", String(maxFiles + maxVideos));

  const percentText = percentLabel.replace("{percent}", String(progress));

  const dropzoneClass = cn(
    "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-5 text-center transition duration-200",
    dragOver ? "border-gold bg-gold/10" : "border-input bg-muted/30 hover:border-gold/70 hover:bg-gold/5",
    pending && "pointer-events-none opacity-70",
  );

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={acceptTypes}
        multiple={!isCover}
        disabled={!inputEnabled}
        className="sr-only"
        onChange={(event) => void handleFiles(event.target.files ?? [])}
      />

      {isCover ? (
        value[0] ? (
          <div
            className="group relative overflow-hidden rounded-2xl border border-border shadow-soft"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="relative aspect-[16/9] w-full bg-muted">
              <Image src={value[0]} alt="" fill className="object-cover" sizes="(min-width: 640px) 560px, 100vw" />
            </div>
            <label
              htmlFor={id}
              className={cn(
                "absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 bg-secondary/55 text-secondary-foreground opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100",
                pending && "opacity-100",
              )}
            >
              {pending ? (
                <UploadProgress
                  percent={progress}
                  percentText={percentText}
                  label={uploadingLabel}
                />
              ) : (
                <>
                  <Camera className="size-7" aria-hidden />
                  <span className="text-sm font-medium">{changeLabel}</span>
                </>
              )}
            </label>
            <button
              type="button"
              className="absolute end-3 top-3 z-10 inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-background/95 text-foreground shadow-soft transition hover:bg-background"
              onClick={() => removeAt(0)}
              disabled={disabled || busy}
              aria-label={removeLabel}
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={id}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(dropzoneClass, "aspect-[16/9] w-full")}
          >
            {pending ? (
              <UploadProgress percent={progress} percentText={percentText} label={uploadingLabel} />
            ) : (
              <>
                <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Camera className="size-6" aria-hidden />
                </span>
                <span className="space-y-1">
                  <span className="block text-sm font-medium">{chooseLabel}</span>
                  {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
                </span>
              </>
            )}
          </label>
        )
      ) : (
        <div
          className={cn("rounded-2xl border border-border bg-card p-3 shadow-soft sm:p-4", dragOver && "border-gold")}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {value.length === 0 && pendingUploads.length === 0 ? (
            <label htmlFor={id} className={cn(dropzoneClass, "min-h-44")}>
              <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Images className="size-6" aria-hidden />
              </span>
              <span className="space-y-1">
                <span className="block text-sm font-medium">{chooseLabel}</span>
                {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
              </span>
            </label>
          ) : (
            <>
              {filledCount ? (
                <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">{filledCount}</p>
              ) : null}
              <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {value.map((src, index) => (
                  <li
                    key={`${src}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <MediaPreview src={src} video={isVideoUrl(src)} />
                    <button
                      type="button"
                      className="absolute end-1.5 top-1.5 z-10 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-background/95 text-foreground shadow-soft transition hover:bg-background sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={() => removeAt(index)}
                      disabled={disabled || busy}
                      aria-label={removeLabel}
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
                {pendingUploads.map((upload) => (
                  <li
                    key={upload.id}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <MediaPreview src={upload.preview} video={upload.kind === "video"} />
                    <span className="absolute inset-0 flex items-center justify-center bg-secondary/55">
                      <UploadProgress
                        percent={upload.percent}
                        percentText={percentLabel.replace("{percent}", String(upload.percent))}
                        label={uploadingLabel}
                        compact
                      />
                    </span>
                  </li>
                ))}
                {canAdd ? (
                  <li>
                    <label
                      htmlFor={id}
                      className={cn(
                        "flex aspect-square h-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-2 text-center transition duration-200",
                        dragOver
                          ? "border-gold bg-gold/10"
                          : "border-input bg-muted/40 hover:border-gold/70 hover:bg-gold/5",
                      )}
                    >
                      <ImagePlus className="size-5 text-gold" aria-hidden />
                      <span className="text-[11px] font-medium leading-tight">{chooseLabel}</span>
                    </label>
                  </li>
                ) : null}
              </ul>
            </>
          )}
        </div>
      )}

      {hint && (isCover ? Boolean(value[0]) : value.length > 0 || pendingUploads.length > 0) ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
