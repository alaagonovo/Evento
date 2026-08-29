import { describe, expect, it } from "vitest";
import {
  isVendorCategorySlug,
  isVendorType,
  VENDOR_CATEGORY_SLUGS,
  VENDOR_CATEGORY_TO_TYPE,
  VENDOR_TYPE_TO_CATEGORY,
  VENDOR_TYPES,
} from "./category";

describe("isVendorCategorySlug", () => {
  it("accepts every supported vendor category", () => {
    for (const slug of VENDOR_CATEGORY_SLUGS) {
      expect(isVendorCategorySlug(slug)).toBe(true);
    }
  });

  it("maps database vendor types to browse slugs", () => {
    expect(VENDOR_TYPE_TO_CATEGORY.venue).toBe("venues");
    expect(VENDOR_TYPE_TO_CATEGORY.florist).toBe("florist");
    expect(VENDOR_TYPE_TO_CATEGORY.videographer).toBe("videography");
    expect(isVendorType("photographer")).toBe(true);
    expect(isVendorType("unknown")).toBe(false);
  });

  it("keeps browse slugs and database types in sync", () => {
    expect(VENDOR_TYPES).toHaveLength(VENDOR_CATEGORY_SLUGS.length);

    for (const slug of VENDOR_CATEGORY_SLUGS) {
      const type = VENDOR_CATEGORY_TO_TYPE[slug];
      expect(VENDOR_TYPE_TO_CATEGORY[type]).toBe(slug);
    }
  });

  it("rejects unknown slugs", () => {
    expect(isVendorCategorySlug("dresses")).toBe(false);
    expect(isVendorCategorySlug("florists")).toBe(false);
    expect(isVendorCategorySlug("")).toBe(false);
  });
});
