import { describe, expect, it } from "vitest";
import type { BookingListItem } from "../types/booking";
import { canRespondToBooking, sortBookingsForVendor } from "./booking-status";

function item(partial: Partial<BookingListItem>): BookingListItem {
  return {
    id: "1",
    eventDate: "2026-10-01",
    eventType: "wedding",
    status: "pending",
    paymentStatus: "unpaid",
    packageType: "standard",
    totalPrice: 1000,
    notes: null,
    createdAt: "2026-09-01T00:00:00.000Z",
    vendor: null,
    customer: null,
    ...partial,
  };
}

describe("booking status", () => {
  it("allows accept only while pending", () => {
    expect(canRespondToBooking("pending", "confirmed")).toBe(true);
    expect(canRespondToBooking("confirmed", "confirmed")).toBe(false);
    expect(canRespondToBooking("cancelled", "cancelled")).toBe(false);
  });

  it("sorts pending requests first", () => {
    const sorted = sortBookingsForVendor([
      item({ id: "c", status: "cancelled", createdAt: "2026-09-03T00:00:00.000Z" }),
      item({ id: "p", status: "pending", createdAt: "2026-09-01T00:00:00.000Z" }),
      item({ id: "ok", status: "confirmed", createdAt: "2026-09-02T00:00:00.000Z" }),
    ]);
    expect(sorted.map((row) => row.id)).toEqual(["p", "ok", "c"]);
  });
});
