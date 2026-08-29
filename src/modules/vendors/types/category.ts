export const VENDOR_CATEGORY_SLUGS = [
  "venues",
  "photographers",
  "planners",
  "makeup-artists",
  "catering",
  "photo-locations",
  "dresses",
] as const;

export type VendorCategorySlug = (typeof VENDOR_CATEGORY_SLUGS)[number];

export const VENDOR_TYPES = [
  "venue",
  "photographer",
  "planner",
  "makeup-artist",
  "caterer",
  "photo-location",
  "dress-rental",
] as const;

export type VendorType = (typeof VENDOR_TYPES)[number];

export const VENDOR_CATEGORY_TO_TYPE: Record<VendorCategorySlug, VendorType> = {
  venues: "venue",
  photographers: "photographer",
  planners: "planner",
  "makeup-artists": "makeup-artist",
  catering: "caterer",
  "photo-locations": "photo-location",
  dresses: "dress-rental",
};

export const VENDOR_TYPE_TO_CATEGORY: Record<VendorType, VendorCategorySlug> = {
  venue: "venues",
  photographer: "photographers",
  planner: "planners",
  "makeup-artist": "makeup-artists",
  caterer: "catering",
  "photo-location": "photo-locations",
  "dress-rental": "dresses",
};

export function isVendorCategorySlug(value: string): value is VendorCategorySlug {
  return (VENDOR_CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function isVendorType(value: string): value is VendorType {
  return (VENDOR_TYPES as readonly string[]).includes(value);
}
