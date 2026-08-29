export const VENDOR_CATEGORY_SLUGS = [
  "venues",
  "bachelorette",
  "beauty-nails",
  "catering",
  "dj",
  "entertainment",
  "favours-products",
  "florist",
  "hairdresser",
  "honeymoon",
  "makeup-artists",
  "media-coverage",
  "officiant",
  "photographers",
  "room-decoration",
  "transportation",
  "veil-designer",
  "videography",
  "wedding-cake",
  "planners",
  "photo-locations",
] as const;

export type VendorCategorySlug = (typeof VENDOR_CATEGORY_SLUGS)[number];

export const VENDOR_TYPES = [
  "venue",
  "bachelorette",
  "beauty-nails",
  "caterer",
  "dj",
  "entertainment",
  "favours-products",
  "florist",
  "hairdresser",
  "honeymoon",
  "makeup-artist",
  "media-coverage",
  "officiant",
  "photographer",
  "room-decoration",
  "transportation",
  "veil-designer",
  "videographer",
  "wedding-cake",
  "planner",
  "photo-location",
] as const;

export type VendorType = (typeof VENDOR_TYPES)[number];

export const VENDOR_CATEGORY_TO_TYPE: Record<VendorCategorySlug, VendorType> = {
  venues: "venue",
  bachelorette: "bachelorette",
  "beauty-nails": "beauty-nails",
  catering: "caterer",
  dj: "dj",
  entertainment: "entertainment",
  "favours-products": "favours-products",
  florist: "florist",
  hairdresser: "hairdresser",
  honeymoon: "honeymoon",
  "makeup-artists": "makeup-artist",
  "media-coverage": "media-coverage",
  officiant: "officiant",
  photographers: "photographer",
  "room-decoration": "room-decoration",
  transportation: "transportation",
  "veil-designer": "veil-designer",
  videography: "videographer",
  "wedding-cake": "wedding-cake",
  planners: "planner",
  "photo-locations": "photo-location",
};

export const VENDOR_TYPE_TO_CATEGORY: Record<VendorType, VendorCategorySlug> = {
  venue: "venues",
  bachelorette: "bachelorette",
  "beauty-nails": "beauty-nails",
  caterer: "catering",
  dj: "dj",
  entertainment: "entertainment",
  "favours-products": "favours-products",
  florist: "florist",
  hairdresser: "hairdresser",
  honeymoon: "honeymoon",
  "makeup-artist": "makeup-artists",
  "media-coverage": "media-coverage",
  officiant: "officiant",
  photographer: "photographers",
  "room-decoration": "room-decoration",
  transportation: "transportation",
  "veil-designer": "veil-designer",
  videographer: "videography",
  "wedding-cake": "wedding-cake",
  planner: "planners",
  "photo-location": "photo-locations",
};

export function isVendorCategorySlug(value: string): value is VendorCategorySlug {
  return (VENDOR_CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function parseVendorCategoryParams(
  value: string | string[] | undefined,
): VendorCategorySlug[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  const slugs = raw.flatMap((item) => item.split(",")).map((item) => item.trim());

  return [...new Set(slugs.filter(isVendorCategorySlug))];
}

export function isVendorType(value: string): value is VendorType {
  return (VENDOR_TYPES as readonly string[]).includes(value);
}
