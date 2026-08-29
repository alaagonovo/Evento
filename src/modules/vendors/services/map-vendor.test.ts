import { describe, expect, it } from "vitest";
import type { Database } from "@/lib/supabase/database.types";
import {
  listVendorsInputSchema,
  mapVendorRow,
  toDbCategory,
  vendorIdSchema,
} from "./map-vendor";

const baseRow: Database["public"]["Tables"]["vendors"]["Row"] = {
  id: "11111111-1111-1111-1111-111111111111",
  profile_id: "22222222-2222-2222-2222-222222222222",
  category: "venue",
  business_name: "Nile Palace",
  description: "Nile-facing hall",
  city: "cairo",
  address: "Zamalek",
  latitude: null,
  longitude: null,
  cover_image: "https://images.unsplash.com/photo-x",
  gallery_images: [],
  price_starting_at: 185000,
  is_verified: true,
  is_approved: true,
  status: "approved",
  avg_rating: 4.9,
  reviews_count: 12,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("vendor mapping", () => {
  it("maps a venue row onto the public category slug", () => {
    const vendor = mapVendorRow(baseRow);
    expect(vendor?.category).toBe("venues");
    expect(vendor?.name.en).toBe("Nile Palace");
    expect(vendor?.startingPrice).toBe(185000);
  });

  it("rejects unknown database categories", () => {
    const vendor = mapVendorRow({
      ...baseRow,
      category: "not-a-category" as Database["public"]["Tables"]["vendors"]["Row"]["category"],
    });
    expect(vendor).toBeNull();
  });

  it("rejects dress rental rows after the category was removed", () => {
    const vendor = mapVendorRow({
      ...baseRow,
      category: "dress-rental" as Database["public"]["Tables"]["vendors"]["Row"]["category"],
    });
    expect(vendor).toBeNull();
  });

  it("maps a florist row onto the public category slug", () => {
    const vendor = mapVendorRow({
      ...baseRow,
      category: "florist",
    });
    expect(vendor?.category).toBe("florist");
  });
});

describe("vendor query schemas", () => {
  it("maps browse slugs to database categories", () => {
    expect(toDbCategory("venues")).toBe("venue");
    expect(toDbCategory("florist")).toBe("florist");
    expect(toDbCategory("videography")).toBe("videographer");
  });

  it("accepts a uuid vendor id", () => {
    expect(vendorIdSchema.parse(baseRow.id)).toBe(baseRow.id);
  });

  it("rejects an invalid list payload", () => {
    expect(() => listVendorsInputSchema.parse({ limit: 0 })).toThrow();
  });

  it("accepts multiple browse categories", () => {
    expect(listVendorsInputSchema.parse({ categories: ["venues", "florist"] }).categories).toEqual([
      "venues",
      "florist",
    ]);
  });
});
