import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { formatPrice, localized } from "@/shared/lib/utils";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import type { MockOffer } from "../data/mock";

type OfferCardProps = {
  offer: MockOffer;
  locale: Locale;
  dictionary: Dictionary;
};

function formatOfferDate(isoDate: string, locale: Locale) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function OfferCard({ offer, locale, dictionary }: OfferCardProps) {
  return (
    <Link
      href={localizedPath(locale, `/vendors/${offer.category}/${offer.vendorId}`)}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={offer.image}
            alt={localized(offer.title, locale)}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <Badge variant="gold" className="absolute top-3 start-3 h-6 px-2.5">
            {dictionary.home.offerDiscount.replace("{percent}", String(offer.discountPercent))}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium tracking-wide text-gold">
            {dictionary.categories[offer.category].title}
          </p>
          <h3 className="font-heading text-lg leading-snug">{localized(offer.title, locale)}</h3>
          <p className="text-sm text-muted-foreground">{localized(offer.vendorName, locale)}</p>
          <p className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-2 text-sm">
            <span className="font-medium text-foreground">{formatPrice(offer.offerPrice, locale)}</span>
            <span className="text-muted-foreground line-through">
              {formatPrice(offer.originalPrice, locale)}
            </span>
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" aria-hidden />
            {dictionary.home.offerUntil.replace("{date}", formatOfferDate(offer.expiresOn, locale))}
          </p>
        </div>
      </article>
    </Link>
  );
}
