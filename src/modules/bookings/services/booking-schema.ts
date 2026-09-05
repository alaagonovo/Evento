import { z } from "zod";
import { isBeforeMinBookableDate } from "@/modules/vendors/lib/booking-notice";
import { WALLET_PROVIDERS, walletPhoneOk } from "@/modules/payments/lib/payment-details";

export const EVENT_TYPES = ["wedding", "engagement", "birthday", "general"] as const;
export const PAYMENT_METHODS = ["card", "wallet", "venue"] as const;

export type EventTypeInput = (typeof EVENT_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const bookingRequestSchema = z
  .object({
    vendorId: z.string().uuid(),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => !isBeforeMinBookableDate(value), { message: "date-unavailable" }),
    eventType: z.enum(EVENT_TYPES),
    packageId: z.string().trim().max(120).optional(),
    paymentMethod: z.enum(PAYMENT_METHODS),
    notes: z.string().trim().max(500).optional(),
    walletProvider: z.enum(WALLET_PROVIDERS).optional(),
    walletPhone: z.string().trim().optional(),
    cardLast4: z.string().regex(/^\d{4}$/).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.paymentMethod === "wallet") {
      if (!value.walletProvider) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["walletProvider"], message: "invalid" });
      }
      if (!value.walletPhone || !walletPhoneOk(value.walletPhone)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["walletPhone"], message: "invalid" });
      }
    }
    if (value.paymentMethod === "card" && !value.cardLast4) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cardLast4"], message: "invalid" });
    }
  });

export type BookingRequestInput = z.input<typeof bookingRequestSchema>;
export type BookingRequestPayload = z.output<typeof bookingRequestSchema>;

export function parseBookingRequest(input: unknown) {
  return bookingRequestSchema.parse(input);
}

export function safeParseBookingRequest(input: unknown) {
  return bookingRequestSchema.safeParse(input);
}
