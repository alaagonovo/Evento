"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { getDirection, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { isVideoUrl } from "@/shared/lib/media";
import { cn, localized } from "@/shared/lib/utils";
import type { DressAngle, VendorPhoto } from "../data/mock";

type VendorGalleryProps = {
  photos: VendorPhoto[];
  locale: Locale;
  dictionary: Dictionary;
  activeAngle?: DressAngle | "all";
};

function isVideoPhoto(photo: VendorPhoto) {
  return photo.kind === "video" || isVideoUrl(photo.src);
}

function GalleryVisual({
  photo,
  locale,
  className,
  priority = false,
  sizes,
  contain = false,
}: {
  photo: VendorPhoto;
  locale: Locale;
  className?: string;
  priority?: boolean;
  sizes: string;
  contain?: boolean;
}) {
  const alt = localized(photo.alt, locale);

  if (isVideoPhoto(photo)) {
    return (
      <video
        src={photo.src}
        className={className}
        controls={contain}
        muted={!contain}
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <Image
      src={photo.src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={contain ? "object-contain" : "object-cover"}
    />
  );
}

function LightboxMedia({ photo, locale }: { photo: VendorPhoto; locale: Locale }) {
  const alt = localized(photo.alt, locale);

  if (isVideoPhoto(photo)) {
    return (
      <video
        src={photo.src}
        className="max-h-[85vh] max-w-[min(92vw,80rem)] rounded-xl"
        controls
        autoPlay
        playsInline
      />
    );
  }

  return (
    <Image
      src={photo.src}
      alt={alt}
      width={1600}
      height={1200}
      sizes="92vw"
      className="h-auto max-h-[85vh] w-auto max-w-[min(92vw,80rem)] object-contain"
    />
  );
}

export function VendorGallery({
  photos,
  locale,
  dictionary,
  activeAngle = "all",
}: VendorGalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isRtl = getDirection(locale) === "rtl";

  const visiblePhotos = useMemo(() => {
    if (activeAngle === "all") return photos;
    const filtered = photos.filter((photo) => photo.angle === activeAngle);
    return filtered.length > 0 ? filtered : photos;
  }, [activeAngle, photos]);

  const current = visiblePhotos[Math.min(index, visiblePhotos.length - 1)];
  const showStripNav = visiblePhotos.length > 5;

  const go = useCallback(
    (offset: number) => {
      setIndex((currentIndex) => {
        const next = currentIndex + offset;
        if (next < 0) return visiblePhotos.length - 1;
        if (next >= visiblePhotos.length) return 0;
        return next;
      });
    },
    [visiblePhotos.length],
  );

  useEffect(() => {
    const selected = scrollerRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    selected?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(isRtl ? 1 : -1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(isRtl ? -1 : 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, open, isRtl]);

  if (!current) return null;

  function selectThumb(photoIndex: number) {
    if (photoIndex === index) {
      setOpen(true);
      return;
    }
    setIndex(photoIndex);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl shadow-soft sm:aspect-[16/10]"
        aria-label={dictionary.vendor.zoom}
      >
        <GalleryVisual
          photo={current}
          locale={locale}
          className="size-full object-cover"
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
        />
        {isVideoPhoto(current) ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft">
              <Play className="size-6 fill-current" aria-hidden />
            </span>
          </span>
        ) : null}
        <span className="absolute end-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs shadow-soft">
          <Expand className="size-3.5" />
          {dictionary.vendor.zoom}
        </span>
      </button>

      <div className="relative">
        {showStripNav ? (
          <>
            <button
              type="button"
              className="absolute start-0 top-1/2 z-10 hidden size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card/95 text-foreground shadow-soft sm:inline-flex"
              onClick={() => go(-1)}
              aria-label={dictionary.vendor.prevPhoto}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              className="absolute end-0 top-1/2 z-10 hidden size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card/95 text-foreground shadow-soft sm:inline-flex"
              onClick={() => go(1)}
              aria-label={dictionary.vendor.nextPhoto}
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </button>
          </>
        ) : null}
        <div
          ref={scrollerRef}
          className={cn(
            "flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            showStripNav && "sm:px-10",
          )}
        >
          {visiblePhotos.map((photo, photoIndex) => (
            <button
              key={`${photo.src}-${photoIndex}`}
              type="button"
              onClick={() => selectThumb(photoIndex)}
              className={cn(
                "relative h-[4.5rem] w-24 shrink-0 snap-start overflow-hidden rounded-xl ring-2 transition duration-200",
                photoIndex === index ? "ring-gold" : "ring-transparent hover:ring-gold/50",
              )}
              aria-pressed={photoIndex === index}
              aria-label={localized(photo.alt, locale)}
            >
              <GalleryVisual photo={photo} locale={locale} className="size-full object-cover" sizes="96px" />
              {isVideoPhoto(photo) ? (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-secondary/25">
                  <Play className="size-4 fill-current text-secondary-foreground" aria-hidden />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          overlayClassName="bg-black/40 backdrop-blur-xl supports-backdrop-filter:backdrop-blur-xl"
          className="max-w-[min(96vw,80rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(96vw,80rem)] [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-card/80 [&_[data-slot=dialog-close]]:backdrop-blur-sm"
        >
          <DialogTitle className="sr-only">{dictionary.vendor.gallery}</DialogTitle>
          <div className="relative flex items-center justify-center">
            <LightboxMedia photo={current} locale={locale} />
            {visiblePhotos.length > 1 ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute start-0 top-1/2 -translate-y-1/2 rounded-full bg-card/80 text-foreground backdrop-blur-sm hover:bg-card/90 hover:text-foreground sm:start-3"
                  onClick={() => go(-1)}
                  aria-label={dictionary.vendor.prevPhoto}
                >
                  <ChevronLeft className="rtl:rotate-180" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute end-0 top-1/2 -translate-y-1/2 rounded-full bg-card/80 text-foreground backdrop-blur-sm hover:bg-card/90 hover:text-foreground sm:end-3"
                  onClick={() => go(1)}
                  aria-label={dictionary.vendor.nextPhoto}
                >
                  <ChevronRight className="rtl:rotate-180" />
                </Button>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
