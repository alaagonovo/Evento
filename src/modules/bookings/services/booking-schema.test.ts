import { describe, expect, it } from "vitest";
import { addLocalDays, minBookableDate } from "@/modules/vendors/lib/booking-notice";
import { safeParseBookingRequest } from "./booking-schema";

const valid = {
  vendorId: "11111111-1111-1111-1111-111111111111",
  eventDate: minBookableDate(),
  eventType: "wedding" as const,
  paymentMethod: "card" as const,
  cardLast4: "1111",
};

describe("bookingRequestSchema", () => {
  it("accepts a complete booking request", () => {
    expect(safeParseBookingRequest(valid).success).toBe(true);
  });

  it("rejects dates inside the search notice window", () => {
    expect(
      safeParseBookingRequest({ ...valid, eventDate: addLocalDays(0) }).success,
    ).toBe(false);
  });

  it("requires card last 4 for card payments", () => {
    expect(safeParseBookingRequest({ ...valid, cardLast4: undefined }).success).toBe(false);
  });

  it("does not require card or wallet details for pay-the-vendor", () => {
    expect(
      safeParseBookingRequest({
        ...valid,
        paymentMethod: "venue",
        cardLast4: undefined,
      }).success,
    ).toBe(true);
  });

  it("requires a wallet phone for wallet payments", () => {
    expect(
      safeParseBookingRequest({ ...valid, paymentMethod: "wallet", walletProvider: "vodafone" })
        .success,
    ).toBe(false);
    expect(
      safeParseBookingRequest({
        ...valid,
        paymentMethod: "wallet",
        walletProvider: "vodafone",
        walletPhone: "01012345678",
        cardLast4: undefined,
      }).success,
    ).toBe(true);
  });
});
