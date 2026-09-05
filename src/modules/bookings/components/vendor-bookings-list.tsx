import { CalendarDays } from "lucide-react";
import { formatDateKey } from "@/modules/vendors/lib/booking-notice";
import { EmptyState } from "@/shared/components/empty-state";
import type { Dictionary, Locale } from "@/shared/lib/i18n";
import { formatPrice } from "@/shared/lib/utils";
import type { BookingListItem } from "../types/booking";
import { BookingStatusBadge } from "./booking-status-badge";
import { VendorBookingActions } from "./vendor-booking-actions";

export function VendorBookingsList({
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
        title={dictionary.empty.vendorBookingsTitle}
        description={dictionary.empty.vendorBookingsHint}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[40rem] text-center text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">{copy.customerName}</th>
            <th className="px-4 py-3 font-medium">{copy.eventDate}</th>
            <th className="px-4 py-3 font-medium">{copy.eventType}</th>
            <th className="px-4 py-3 font-medium">{copy.package}</th>
            <th className="px-4 py-3 font-medium">{copy.total}</th>
            <th className="px-4 py-3 font-medium">{copy.statusLabel}</th>
            <th className="px-4 py-3 font-medium">{copy.actions}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="flex flex-col items-center">
                  <span className="font-medium">{booking.customer?.name ?? copy.unknownCustomer}</span>
                  {booking.customer?.phone ? (
                    <span className="text-xs text-muted-foreground" dir="ltr">
                      {booking.customer.phone}
                    </span>
                  ) : booking.customer?.email ? (
                    <span className="text-xs text-muted-foreground">{booking.customer.email}</span>
                  ) : null}
                  {booking.notes ? (
                    <span className="mt-1 max-w-[14rem] truncate text-xs text-muted-foreground">
                      {booking.notes}
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3">{formatDateKey(booking.eventDate, locale)}</td>
              <td className="px-4 py-3">{copy.eventTypes[booking.eventType]}</td>
              <td className="px-4 py-3">{booking.packageType ?? copy.startingPackage}</td>
              <td className="px-4 py-3">{formatPrice(booking.totalPrice, locale)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  <BookingStatusBadge status={booking.status} dictionary={dictionary} />
                </div>
              </td>
              <td className="px-4 py-3">
                {booking.status === "pending" ? (
                  <VendorBookingActions
                    bookingId={booking.id}
                    locale={locale}
                    dictionary={dictionary}
                  />
                ) : booking.status === "confirmed" ? (
                  <VendorBookingActions
                    bookingId={booking.id}
                    locale={locale}
                    dictionary={dictionary}
                    allowAccept={false}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">{copy.noActions}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
