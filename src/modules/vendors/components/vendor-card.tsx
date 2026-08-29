import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/shared/components/star-rating";
import { Badge } from "@/shared/components/ui/badge";
import { cn, formatPrice, localized } from "@/shared/lib/utils";
import { cityLabel } from "../lib/city-label";
import { formatDistanceKm } from "../lib/geo";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import type { VendorView } from "../types/vendor";

type VendorCardProps = {
  vendor: VendorView;
  locale: Locale;
  dictionary: Dictionary;
  className?: string;
};

export function VendorCard({ vendor, locale, dictionary, className }: VendorCardProps) {
  return (
    <Link
      href={localizedPath(locale, `/vendors/${vendor.category}/${vendor.id}`)}
      className={cn("group block h-full", className)}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={vendor.coverImage}
            alt={localized(vendor.name, locale)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          {vendor.verified ? (
            <Badge variant="gold" className="absolute top-3 start-3">
              {dictionary.vendor.verified}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-lg leading-snug">
              {localized(vendor.name, locale)}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm">
              <StarRating value={vendor.rating} />
              <span className="font-medium">{vendor.rating.toFixed(1)}</span>
            </span>
          </div>
          <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {cityLabel(vendor.city, dictionary)} · {localized(vendor.neighborhood, locale)}
            {vendor.distanceKm != null && Number.isFinite(vendor.distanceKm) ? (
              <span className="text-gold">
                · {formatDistanceKm(vendor.distanceKm, locale)} {dictionary.vendor.away}
              </span>
            ) : null}
          </p>
          <p className="mt-auto pt-2 text-sm">
            <span className="text-muted-foreground">{dictionary.vendor.fromPrice} </span>
            <span className="font-medium">{formatPrice(vendor.startingPrice, locale)}</span>
          </p>
        </div>
      </article>
    </Link>
  );
}
