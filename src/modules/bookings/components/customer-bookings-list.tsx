import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { cityLabel } from "@/modules/vendors/lib/city-label";
import { isVendorType, VENDOR_TYPE_TO_CATEGORY } from "@/modules/vendors/types/category";
import { formatDateKey } from "@/modules/vendors/lib/booking-notice";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { formatPrice } from "@/shared/lib/utils";
import type { BookingListItem } from "../types/booking";
import { BookingStatusBadge } from "./booking-status-badge";

export function CustomerBookingsList({
  bookings,
  locale,
  dictionary,
}: {
  bookings: BookingListItem[];
  locale: Locale;
  dictionary: Dictionary;
}) {
  const copy = dictionary.booking;

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="size-6" aria-hidden />}
        title={dictionary.empty.bookingsTitle}
        description={dictionary.empty.bookingsHint}
      />
    );
  }

  return (
    <ul className="grid gap-3">
      {bookings.map((booking) => {
        const categorySlug =
          booking.vendor && isVendorType(booking.vendor.category)
            ? VENDOR_TYPE_TO_CATEGORY[booking.vendor.category]
            : "venues";
        const href = booking.vendor
          ? localizedPath(locale, `/vendors/${categorySlug}/${booking.vendor.id}`)
          : null;

        return (
          <li key={booking.id} className="rounded-2xl bg-card p-4 shadow-soft sm:p-5">
            <div className="flex gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {booking.vendor?.coverImage ? (
                  <Image
                    src={booking.vendor.coverImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{booking.vendor?.name ?? copy.unknownVendor}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.vendor
                        ? `${dictionary.categories[categorySlug].title} · ${cityLabel(booking.vendor.city, dictionary)}`
                        : copy.unknownVendor}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} dictionary={dictionary} />
                </div>
                <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                  <div className="flex justify-between gap-3 sm:justify-start sm:gap-2">
                    <dt className="text-muted-foreground">{copy.eventDate}</dt>
                    <dd className="font-medium">{formatDateKey(booking.eventDate, locale)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:justify-start sm:gap-2">
                    <dt className="text-muted-foreground">{copy.eventType}</dt>
                    <dd className="font-medium">{copy.eventTypes[booking.eventType]}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:justify-start sm:gap-2">
                    <dt className="text-muted-foreground">{copy.package}</dt>
                    <dd className="font-medium">{booking.packageType ?? copy.startingPackage}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:justify-start sm:gap-2">
                    <dt className="text-muted-foreground">{copy.total}</dt>
                    <dd className="font-medium">{formatPrice(booking.totalPrice, locale)}</dd>
                  </div>
                </dl>
                {href ? (
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link href={href}>{copy.backToVendor}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
