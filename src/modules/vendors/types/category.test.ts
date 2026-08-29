import { describe, expect, it } from "vitest";
import { isVendorCategorySlug, isVendorType, VENDOR_TYPE_TO_CATEGORY } from "./category";

describe("isVendorCategorySlug", () => {
  it("accepts every supported vendor category", () => {
    expect(isVendorCategorySlug("venues")).toBe(true);
    expect(isVendorCategorySlug("photographers")).toBe(true);
    expect(isVendorCategorySlug("planners")).toBe(true);
    expect(isVendorCategorySlug("makeup-artists")).toBe(true);
    expect(isVendorCategorySlug("catering")).toBe(true);
    expect(isVendorCategorySlug("photo-locations")).toBe(true);
    expect(isVendorCategorySlug("dresses")).toBe(true);
  });

  it("maps database vendor types to browse slugs", () => {
    expect(VENDOR_TYPE_TO_CATEGORY.venue).toBe("venues");
    expect(VENDOR_TYPE_TO_CATEGORY["dress-rental"]).toBe("dresses");
    expect(isVendorType("photographer")).toBe(true);
    expect(isVendorType("unknown")).toBe(false);
  });

  it("rejects unknown slugs", () => {
    expect(isVendorCategorySlug("florists")).toBe(false);
    expect(isVendorCategorySlug("")).toBe(false);
  });
});
