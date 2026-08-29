import { z } from "zod";
import {
  isGoogleMapsLink,
  isShortGoogleMapsLink,
  parseGoogleMapsCoords,
} from "../lib/parse-google-maps-location";
import { VENDOR_TYPES } from "../types/category";

const urlListSchema = z
  .string()
  .trim()
  .min(1)
  .transform((raw) =>
    raw
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().url()).min(1).max(12));

function requiredNumber() {
  return z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    if (typeof value === "number" && Number.isNaN(value)) return undefined;
    return value;
  }, z.coerce.number());
}

export const onboardingSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  category: z.enum(VENDOR_TYPES),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(4).max(160),
  description: z.string().trim().min(20).max(2000),
  coverImage: z.string().trim().url(),
  locationLink: z
    .string()
    .trim()
    .url()
    .refine((value) => isGoogleMapsLink(value), {
      message: "Enter a Google Maps location link",
    })
    .refine(
      (value) => Boolean(parseGoogleMapsCoords(value) || isShortGoogleMapsLink(value)),
      {
        message: "Enter a Google Maps pin link that includes the location",
      },
    ),
  priceStartingAt: requiredNumber().pipe(z.number().positive().max(1_000_000_000)),
  galleryImages: urlListSchema,
});

export type VendorOnboardingInput = z.input<typeof onboardingSchema>;
export type VendorOnboardingPayload = z.output<typeof onboardingSchema>;

export function parseVendorOnboarding(input: unknown) {
  return onboardingSchema.parse(input);
}

export function safeParseVendorOnboarding(input: unknown) {
  return onboardingSchema.safeParse(input);
}
