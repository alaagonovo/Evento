"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { localized } from "@/shared/lib/utils";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import type { DressAngle, VendorPhoto } from "../data/mock";

type VendorGalleryProps = {
  photos: VendorPhoto[];
  locale: Locale;
  dictionary: Dictionary;
  activeAngle?: DressAngle | "all";
};

export function VendorGallery({
  photos,
  locale,
  dictionary,
  activeAngle = "all",
}: VendorGalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const visiblePhotos = useMemo(() => {
    if (activeAngle === "all") return photos;
    const filtered = photos.filter((photo) => photo.angle === activeAngle);
    return filtered.length > 0 ? filtered : photos;
  }, [activeAngle, photos]);

  const current = visiblePhotos[Math.min(index, visiblePhotos.length - 1)];

  if (!current) return null;

  function go(offset: number) {
    setIndex((currentIndex) => {
      const next = currentIndex + offset;
      if (next < 0) return visiblePhotos.length - 1;
      if (next >= visiblePhotos.length) return 0;
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-soft sm:aspect-[16/10]"
        aria-label={dictionary.vendor.zoom}
      >
        <Image
          src={current.src}
          alt={localized(current.alt, locale)}
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover"
        />
        <span className="absolute end-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs shadow-soft">
          <Expand className="size-3.5" />
          {dictionary.vendor.zoom}
        </span>
      </button>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {visiblePhotos.map((photo, photoIndex) => (
          <button
            key={`${photo.src}-${photoIndex}`}
            type="button"
            onClick={() => setIndex(photoIndex)}
            className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl ring-2 ring-transparent transition aria-pressed:ring-primary"
            aria-pressed={photoIndex === index}
            aria-label={localized(photo.alt, locale)}
          >
            <Image src={photo.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-5xl border-0 bg-secondary p-0 sm:max-w-5xl"
          showCloseButton
        >
          <DialogTitle className="sr-only">{dictionary.vendor.gallery}</DialogTitle>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={current.src}
              alt={localized(current.alt, locale)}
              fill
              sizes="90vw"
              className="object-contain"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute start-3 top-1/2 -translate-y-1/2"
              onClick={() => go(-1)}
              aria-label={dictionary.vendor.prevPhoto}
            >
              <ChevronLeft className="rtl:rotate-180" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute end-3 top-1/2 -translate-y-1/2"
              onClick={() => go(1)}
              aria-label={dictionary.vendor.nextPhoto}
            >
              <ChevronRight className="rtl:rotate-180" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
