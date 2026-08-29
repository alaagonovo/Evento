import { describe, expect, it } from "vitest";
import { parseVendorOnboarding } from "./onboarding-schema";

const validInput = {
  businessName: "Nile Hall",
  category: "venue" as const,
  city: "cairo",
  address: "Zamalek, Cairo",
  description: "A riverside hall for weddings and private celebrations.",
  coverImage: "https://images.unsplash.com/photo-example",
  locationLink: "https://www.google.com/maps/place/Zamalek/@30.0616,31.2194,16z",
  priceStartingAt: 85000,
  galleryImages:
    "https://images.unsplash.com/photo-one\nhttps://images.unsplash.com/photo-two",
};

describe("parseVendorOnboarding", () => {
  it("accepts a complete application and splits gallery URLs", () => {
    const parsed = parseVendorOnboarding(validInput);
    expect(parsed.galleryImages).toEqual([
      "https://images.unsplash.com/photo-one",
      "https://images.unsplash.com/photo-two",
    ]);
    expect(parsed.priceStartingAt).toBe(85000);
    expect(parsed.locationLink).toBe(validInput.locationLink);
  });

  it("rejects a missing starting price", () => {
    expect(() => parseVendorOnboarding({ ...validInput, priceStartingAt: "" })).toThrow();
  });

  it("rejects a missing Google Maps link", () => {
    expect(() => parseVendorOnboarding({ ...validInput, locationLink: "" })).toThrow();
  });

  it("rejects a non-Maps URL as the location", () => {
    expect(() =>
      parseVendorOnboarding({
        ...validInput,
        locationLink: "https://images.unsplash.com/photo-example",
      }),
    ).toThrow();
  });

  it("rejects an empty gallery", () => {
    expect(() => parseVendorOnboarding({ ...validInput, galleryImages: "  " })).toThrow();
  });

  it("rejects a non-URL gallery entry", () => {
    expect(() =>
      parseVendorOnboarding({ ...validInput, galleryImages: "not-a-url" }),
    ).toThrow();
  });
});
