"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { UserAvatar } from "@/shared/components/user-avatar";
import { cn } from "@/shared/lib/utils";
import type { Dictionary } from "@/shared/lib/i18n";
import { deleteCloudinaryImage, uploadLocalImage } from "@/shared/lib/upload-image";
import { updateProfileAvatar } from "../services/actions";
import { MAX_IMAGE_BYTES } from "@/shared/lib/upload-limits";

type ProfilePhotoFormProps = {
  name: string;
  initialUrl: string | null;
  dictionary: Dictionary;
};

export function ProfilePhotoForm({ name, initialUrl, dictionary }: ProfilePhotoFormProps) {
  const copy = dictionary.profile;
  const common = dictionary.common;
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  async function onFilesSelected(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setError(false);
    if (file.size > MAX_IMAGE_BYTES) {
      setError(true);
      return;
    }

    setPending(true);
    setProgress(0);
    try {
      const previous = url;
      const uploaded = await uploadLocalImage(file, "profile", setProgress);
      const result = await updateProfileAvatar(uploaded);
      if (!result.ok) {
        setError(true);
        void deleteCloudinaryImage(uploaded);
        return;
      }
      setUrl(uploaded);
      if (previous && previous !== uploaded) {
        void deleteCloudinaryImage(previous);
      }
    } catch {
      setError(true);
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="group relative size-24 shrink-0">
        <UserAvatar
          name={name}
          src={url || null}
          size="default"
          className="size-24 after:border-gold/40"
          fallbackClassName="text-2xl"
        />
        <label
          htmlFor="avatar-upload"
          className={cn(
            "absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-secondary/60 text-secondary-foreground opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100",
            pending && "opacity-100",
          )}
        >
          {pending ? (
            <span className="font-heading text-sm tabular-nums">
              {common.uploadingPercent.replace("{percent}", String(progress))}
            </span>
          ) : (
            <Camera className="size-7" aria-hidden />
          )}
          <span className="sr-only">{copy.uploadPhoto}</span>
        </label>
        <input
          ref={inputRef}
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={pending}
          onChange={(event) => void onFilesSelected(event.target.files)}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{common.uploadFailed}</p> : null}
    </div>
  );
}
