import type { LocalizedText, VendorPhoto, VendorPackage, VendorReview } from "../data/mock";
import type { VendorCategorySlug } from "./category";

export type VendorView = {
  id: string;
  category: VendorCategorySlug;
  name: LocalizedText;
  city: string;
  neighborhood: LocalizedText;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  capacity?: number;
  verified: boolean;
  featured: boolean;
  coverImage: string;
  description: LocalizedText;
  highlights: LocalizedText[];
  gallery: VendorPhoto[];
  packages: VendorPackage[];
  bookedDates: string[];
  reviews: VendorReview[];
  sizes?: string[];
  latitude?: number | null;
  longitude?: number | null;
  distanceKm?: number;
};

export function asLocalized(value: string): LocalizedText {
  return { ar: value, en: value };
}
