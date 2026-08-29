import type { VendorCategorySlug } from "@/modules/vendors";

export type HighlightReview = {
  id: string;
  author: { ar: string; en: string };
  rating: number;
  date: { ar: string; en: string };
  text: { ar: string; en: string };
  category: VendorCategorySlug;
  vendorName: { ar: string; en: string };
};
