import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { Container } from "@/shared/components/container";
import { StarRating } from "@/shared/components/star-rating";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { formatPrice, localized } from "@/shared/lib/utils";
import { cityLabel } from "../lib/city-label";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import type { VendorView } from "../types/vendor";
import { AvailabilityCalendar } from "./availability-calendar";
import { BookNowBar } from "./book-now-bar";
import { VendorMediaBlock } from "./vendor-media-block";
import { VendorReviews } from "./vendor-reviews";

type VendorDetailViewProps = {
  vendor: VendorView;
  locale: Locale;
  dictionary: Dictionary;
};

export function VendorDetailView({
  vendor,
  locale,
  dictionary,
}: VendorDetailViewProps) {
  const name = localized(vendor.name, locale);

  return (
    <div className="pb-28 lg:pb-16">
      <Container className="space-y-8 py-8">
        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href={localizedPath(locale, "/")} className="hover:text-foreground">
            {dictionary.nav.home}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={localizedPath(locale, `/vendors/${vendor.category}`)}
            className="hover:text-foreground"
          >
            {dictionary.categories[vendor.category].title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_22rem] lg:items-start">
          <div className="space-y-8">
            <VendorMediaBlock vendor={vendor} locale={locale} dictionary={dictionary} />

            <section className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {vendor.verified ? (
                      <Badge variant="gold">{dictionary.vendor.verified}</Badge>
                    ) : null}
                    <Badge variant="secondary">
                      {dictionary.categories[vendor.category].title}
                    </Badge>
                  </div>
                  <h1 className="font-heading text-3xl sm:text-4xl">{name}</h1>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="size-4" />
                    {cityLabel(vendor.city, dictionary)} · {localized(vendor.neighborhood, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-soft">
                  <StarRating value={vendor.rating} />
                  <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({vendor.reviewCount} {dictionary.vendor.reviewsCount})
                  </span>
                </div>
              </div>

              {vendor.capacity ? (
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  {vendor.capacity} {dictionary.vendor.guests}
                </p>
              ) : null}

              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                {localized(vendor.description, locale)}
              </p>
            </section>

            <section>
              <h2 className="font-heading mb-4 text-2xl">{dictionary.vendor.services}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {vendor.highlights.map((item) => (
                  <li
                    key={localized(item, locale)}
                    className="rounded-xl bg-card px-4 py-3 text-sm shadow-soft"
                  >
                    {localized(item, locale)}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-heading mb-4 text-2xl">{dictionary.vendor.packages}</h2>
              <div className="grid gap-4">
                {vendor.packages.map((item) => (
                  <article key={item.id} className="rounded-2xl bg-card p-5 shadow-soft">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-heading text-xl">{localized(item.name, locale)}</h3>
                      <p className="font-medium">
                        {formatPrice(item.price, locale)}
                        <span className="ms-1 text-sm font-normal text-muted-foreground">
                          {item.unit === "day"
                            ? dictionary.vendor.perDay
                            : dictionary.vendor.perEvent}
                        </span>
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {localized(item.details, locale)}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <AvailabilityCalendar
              bookedDates={vendor.bookedDates}
              locale={locale}
              dictionary={dictionary}
            />

            <section>
              <h2 className="font-heading mb-4 text-2xl">{dictionary.vendor.reviews}</h2>
              <VendorReviews
                reviews={vendor.reviews}
                locale={locale}
                dictionary={dictionary}
              />
            </section>
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-2xl bg-card p-5 shadow-lift">
              <p className="text-sm text-muted-foreground">{dictionary.vendor.startingFrom}</p>
              <p className="mt-1 font-heading text-3xl">
                {formatPrice(vendor.startingPrice, locale)}
              </p>
              <Separator className="my-4" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {localized(vendor.description, locale)}
              </p>
              <Button asChild size="xl" className="mt-5 w-full">
                <Link href={localizedPath(locale, `/booking/${vendor.id}`)}>
                  {dictionary.vendor.bookNow}
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {dictionary.vendor.book}
              </p>
            </div>
          </aside>
        </div>
      </Container>

      <BookNowBar
        vendorId={vendor.id}
        price={vendor.startingPrice}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  );
}
