import type { BookingStatus } from "@/lib/supabase/database.types";
import type { BookingListItem, BookingResponse } from "../types/booking";

const STATUS_ORDER: Record<BookingStatus, number> = {
  pending: 0,
  confirmed: 1,
  cancelled: 2,
};

export function canRespondToBooking(status: BookingStatus, next: BookingResponse) {
  if (next === "confirmed") return status === "pending";
  return status === "pending" || status === "confirmed";
}

export function sortBookingsForVendor(items: BookingListItem[]) {
  return [...items].sort((left, right) => {
    const statusDiff = STATUS_ORDER[left.status] - STATUS_ORDER[right.status];
    if (statusDiff !== 0) return statusDiff;
    return right.createdAt.localeCompare(left.createdAt);
  });
}
