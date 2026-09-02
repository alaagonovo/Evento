import { z } from "zod";
import type { Database, VendorCategory } from "@/lib/supabase/database.types";
import { CATEGORY_IMAGES } from "../data/mock";
import {
  VENDOR_CATEGORY_SLUGS,
  VENDOR_CATEGORY_TO_TYPE,
  VENDOR_TYPE_TO_CATEGORY,
  isVendorType,
  type VendorCategorySlug,
} from "../types/category";
import { isVideoUrl } from "@/shared/lib/media";
import { asLocalized, type VendorView } from "../types/vendor";

type VendorRow = Database["public"]["Tables"]["vendors"]["Row"];

export const listVendorsInputSchema = z.object({
  category: z.enum(VENDOR_CATEGORY_SLUGS).optional(),
  categories: z.array(z.enum(VENDOR_CATEGORY_SLUGS)).max(VENDOR_CATEGORY_SLUGS.length).optional(),
  city: z.string().trim().max(80).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  limit: z.number().int().min(1).max(48).optional(),
});

export type ListVendorsInput = z.infer<typeof listVendorsInputSchema>;

export const vendorIdSchema = z.string().uuid();

export function toDbCategory(slug: VendorCategorySlug): VendorCategory {
  return VENDOR_CATEGORY_TO_TYPE[slug];
}

export function resolveImageUrl(src: string | null | undefined, fallback: string) {
  if (!src) return fallback;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return fallback;

  return `${base}/storage/v1/object/public/${src.replace(/^\/+/, "")}`;
}

export function mapVendorRow(
  row: VendorRow,
  extras?: Partial<VendorView>,
): VendorView | null {
  if (!isVendorType(row.category)) {
    return null;
  }

  const category = VENDOR_TYPE_TO_CATEGORY[row.category];
  const fallbackImage = CATEGORY_IMAGES[category];
  const galleryUrls = (row.gallery_images ?? [])
    .map((src) => resolveImageUrl(src, fallbackImage))
    .filter(Boolean);

  return {
    id: row.id,
    category,
    name: asLocalized(row.business_name),
    city: row.city,
    neighborhood: asLocalized(row.address ?? row.city),
    startingPrice: Number(extras?.startingPrice ?? row.price_starting_at ?? 0),
    rating: Number(row.avg_rating ?? 0),
    reviewCount: Number(row.reviews_count ?? 0),
    verified: row.is_verified,
    featured: row.is_verified,
    coverImage: resolveImageUrl(row.cover_image, fallbackImage),
    description: asLocalized(row.description ?? ""),
    highlights: extras?.highlights ?? [],
    gallery:
      galleryUrls.length > 0
        ? galleryUrls.map((src) => ({
            src,
            alt: asLocalized(row.business_name),
            kind: isVideoUrl(src) ? ("video" as const) : ("image" as const),
          }))
        : [
            {
              src: resolveImageUrl(row.cover_image, fallbackImage),
              alt: asLocalized(row.business_name),
            },
          ],
    packages: extras?.packages ?? [],
    bookedDates: extras?.bookedDates ?? [],
    reviews: extras?.reviews ?? [],
    capacity: extras?.capacity,
    sizes: extras?.sizes,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}
