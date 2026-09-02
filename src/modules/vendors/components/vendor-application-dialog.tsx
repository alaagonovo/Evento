"use client";

import type { ReactNode } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { isVideoUrl } from "@/shared/lib/media";
import { formatPrice } from "@/shared/lib/utils";
import type { Dictionary, Locale } from "@/shared/lib/i18n";
import { cityLabel } from "../lib/city-label";
import { googleMapsSearchUrl } from "../lib/parse-google-maps-location";
import type { AdminVendorApplication } from "../services/vendor-account";
import { isVendorType, VENDOR_TYPE_TO_CATEGORY } from "../types/category";
import { VendorStatusBadge } from "./vendor-status-badge";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/35 px-3.5 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium wrap-break-word">{children}</dd>
    </div>
  );
}

export function VendorApplicationDialog({
  vendor,
  dictionary,
  locale,
}: {
  vendor: AdminVendorApplication;
  dictionary: Dictionary;
  locale: Locale;
}) {
  const categorySlug = isVendorType(vendor.category)
    ? VENDOR_TYPE_TO_CATEGORY[vendor.category]
    : "venues";
  const mapsUrl =
    vendor.latitude != null && vendor.longitude != null
      ? googleMapsSearchUrl(vendor.latitude, vendor.longitude)
      : null;
  const gallery = vendor.gallery_images.filter(Boolean);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          {dictionary.admin.showApplication}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="gap-3 px-6 pt-6 pb-4 pe-14">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-xl">{vendor.business_name}</DialogTitle>
            <VendorStatusBadge status={vendor.status} dictionary={dictionary} />
          </div>
          <DialogDescription>{dictionary.admin.applicationDetails}</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <div className="space-y-5">
              <Section title={dictionary.admin.applicationMedia}>
                {vendor.cover_image ? (
                  <div className="overflow-hidden rounded-2xl border border-border/80">
                    {/* User-submitted URLs are not in our image pipeline. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vendor.cover_image}
                      alt={vendor.business_name}
                      className="aspect-[16/8] w-full object-cover"
                    />
                  </div>
                ) : null}
                {gallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {gallery.map((src) =>
                      isVideoUrl(src) ? (
                        <span key={src} className="relative block overflow-hidden rounded-xl ring-1 ring-border/70">
                          <video
                            src={src}
                            className="aspect-square w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                            controls
                          />
                        </span>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={src}
                          src={src}
                          alt=""
                          className="aspect-square w-full rounded-xl object-cover ring-1 ring-border/70"
                        />
                      ),
                    )}
                  </div>
                ) : !vendor.cover_image ? (
                  <p className="text-sm text-muted-foreground">—</p>
                ) : null}
              </Section>
            </div>

            <div className="space-y-5">
              <Section title={dictionary.admin.applicationInfo}>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Fact label={dictionary.onboarding.category}>
                    {dictionary.categories[categorySlug].title}
                  </Fact>
                  <Fact label={dictionary.onboarding.city}>
                    {cityLabel(vendor.city, dictionary)}
                  </Fact>
                  <Fact label={dictionary.onboarding.startingPrice}>
                    {vendor.price_starting_at != null
                      ? formatPrice(vendor.price_starting_at, locale)
                      : "—"}
                  </Fact>
                  <Fact label={dictionary.onboarding.address}>
                    {vendor.address || "—"}
                  </Fact>
                </dl>
              </Section>

              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/35 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    {dictionary.admin.openInMaps}
                  </span>
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              ) : (
                <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                  {dictionary.admin.noLocation}
                </p>
              )}

              <Section title={dictionary.onboarding.description}>
                <p className="rounded-xl border border-border/80 bg-muted/35 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {vendor.description || "—"}
                </p>
              </Section>
            </div>
          </div>
        </div>
        <DialogFooter className="mx-0 mb-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {dictionary.admin.close}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
