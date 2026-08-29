import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { asLocalized } from "../types/vendor";
import type { VendorView } from "../types/vendor";
import { haversineKm } from "../lib/geo";
import {
  listVendorsInputSchema,
  mapVendorRow,
  toDbCategory,
  vendorIdSchema,
  type ListVendorsInput,
} from "./map-vendor";

type VendorRow = Database["public"]["Tables"]["vendors"]["Row"];
type VenueDetails = Database["public"]["Tables"]["venue_details"]["Row"];
type PhotoLocationDetails = Database["public"]["Tables"]["photo_location_details"]["Row"];
type PhotographerPackage = Database["public"]["Tables"]["photographer_packages"]["Row"];
type PlannerPackage = Database["public"]["Tables"]["planner_packages"]["Row"];
type MakeupService = Database["public"]["Tables"]["makeup_artist_services"]["Row"];
type CateringPackage = Database["public"]["Tables"]["catering_packages"]["Row"];
type DressRow = Database["public"]["Tables"]["dresses"]["Row"];
type AvailabilityRow = Database["public"]["Tables"]["availability"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

type VendorDetailRow = VendorRow & {
  venue_details: VenueDetails | VenueDetails[] | null;
  photo_location_details: PhotoLocationDetails | PhotoLocationDetails[] | null;
  photographer_packages: PhotographerPackage[] | null;
  planner_packages: PlannerPackage[] | null;
  makeup_artist_services: MakeupService[] | null;
  catering_packages: CateringPackage[] | null;
  dresses: DressRow[] | null;
  availability: Pick<AvailabilityRow, "date" | "is_available">[] | null;
  reviews: ReviewRow[] | null;
};

function firstRelated<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listApprovedVendors(input: ListVendorsInput = {}): Promise<VendorView[]> {
  const parsed = listVendorsInputSchema.parse(input);
  const supabase = await createClient();

  let query = supabase
    .from("vendors")
    .select(
      "id, profile_id, category, business_name, description, city, address, cover_image, gallery_images, price_starting_at, is_verified, is_approved, status, avg_rating, reviews_count, latitude, longitude, created_at, updated_at",
    )
    .eq("is_approved", true)
    .order("avg_rating", { ascending: false });

  const categorySlugs = [
    ...new Set([
      ...(parsed.categories ?? []),
      ...(parsed.category ? [parsed.category] : []),
    ]),
  ];

  if (categorySlugs.length === 1) {
    query = query.eq("category", toDbCategory(categorySlugs[0]));
  } else if (categorySlugs.length > 1) {
    query = query.in("category", categorySlugs.map(toDbCategory));
  }

  const near =
    parsed.lat != null && parsed.lng != null
      ? { latitude: parsed.lat, longitude: parsed.lng }
      : null;

  if (parsed.city && !near) {
    query = query.ilike("city", `%${parsed.city}%`);
  }

  if (parsed.limit && !near) {
    query = query.limit(parsed.limit);
  } else if (near) {
    query = query.limit(48);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  const vendors = (data ?? [])
    .map((row) => mapVendorRow(row))
    .filter((vendor): vendor is VendorView => vendor !== null);

  if (!near) {
    return vendors;
  }

  return vendors
    .map((vendor) => {
      if (vendor.latitude == null || vendor.longitude == null) {
        return { ...vendor, distanceKm: Number.POSITIVE_INFINITY };
      }

      return {
        ...vendor,
        distanceKm: haversineKm(near, {
          latitude: vendor.latitude,
          longitude: vendor.longitude,
        }),
      };
    })
    .sort((left, right) => (left.distanceKm ?? Infinity) - (right.distanceKm ?? Infinity))
    .slice(0, parsed.limit ?? 24);
}

export async function listFeaturedVendors(): Promise<VendorView[]> {
  return listApprovedVendors({ limit: 6 });
}

export async function getApprovedVendorById(id: string): Promise<VendorView | null> {
  const parsedId = vendorIdSchema.safeParse(id);

  if (!parsedId.success) {
    return null;
  }

  const supabase = await createClient();

  const detailed = await supabase
    .from("vendors")
    .select(
      `
      *,
      venue_details (*),
      photo_location_details (*),
      photographer_packages (*),
      planner_packages (*),
      makeup_artist_services (*),
      catering_packages (*),
      dresses (*),
      availability (date, is_available),
      reviews (id, rating, comment, created_at, customer_id, booking_id, vendor_id)
    `,
    )
    .eq("id", parsedId.data)
    .eq("is_approved", true)
    .maybeSingle();

  if (detailed.data) {
    return mapVendorDetail(detailed.data as VendorDetailRow);
  }

  const fallback = await supabase
    .from("vendors")
    .select("*")
    .eq("id", parsedId.data)
    .eq("is_approved", true)
    .maybeSingle();

  if (!fallback.data) {
    return null;
  }

  return mapVendorRow(fallback.data);
}

function mapVendorDetail(row: VendorDetailRow): VendorView | null {
  const venue = firstRelated(row.venue_details);
  const location = firstRelated(row.photo_location_details);
  const photographerPackages = row.photographer_packages ?? [];
  const plannerPackages = row.planner_packages ?? [];
  const makeupServices = row.makeup_artist_services ?? [];
  const cateringPackages = row.catering_packages ?? [];
  const dresses = row.dresses ?? [];

  const packages = [
    ...photographerPackages.map((item) => ({
      id: item.id,
      name: asLocalized(item.name),
      price: Number(item.price),
      unit: "event" as const,
      details: asLocalized(item.description ?? item.deliverables ?? ""),
    })),
    ...plannerPackages.map((item) => ({
      id: item.id,
      name: asLocalized(item.name),
      price: Number(item.price),
      unit: "event" as const,
      details: asLocalized(item.description ?? item.services_included.join("، ")),
    })),
    ...makeupServices.map((item) => ({
      id: item.id,
      name: asLocalized(item.service_name),
      price: Number(item.price),
      unit: "event" as const,
      details: asLocalized(
        item.trial_available ? "Includes a trial appointment." : "",
      ),
    })),
    ...cateringPackages.map((item) => ({
      id: item.id,
      name: asLocalized(item.name),
      price: Number(item.price_per_person),
      unit: "event" as const,
      details: asLocalized(item.menu_items.join("، ")),
    })),
    ...dresses.map((item) => ({
      id: item.id,
      name: asLocalized(item.name),
      price: Number(item.rental_price ?? item.purchase_price ?? 0),
      unit: "event" as const,
      details: asLocalized(item.description ?? item.color ?? ""),
    })),
  ];

  if (venue) {
    packages.unshift({
      id: `${row.id}-venue`,
      name: asLocalized("Event booking"),
      price: Number(venue.price_per_event),
      unit: "event",
      details: asLocalized((venue.amenities ?? []).join("، ")),
    });
  }

  if (location) {
    packages.unshift({
      id: `${row.id}-location`,
      name: asLocalized("Hourly booking"),
      price: Number(location.hourly_rate),
      unit: "event",
      details: asLocalized(location.indoor_outdoor ?? ""),
    });
  }

  const highlights = [
    ...(venue?.amenities ?? []).map(asLocalized),
    ...(plannerPackages[0]?.services_included ?? []).map(asLocalized),
  ];

  const sizes = dresses.flatMap((item) => item.sizes_available);
  const bookedDates = (row.availability ?? [])
    .filter((slot) => !slot.is_available)
    .map((slot) => slot.date);

  const reviews = (row.reviews ?? []).map((review) => ({
    id: review.id,
    author: asLocalized("Evento guest"),
    rating: review.rating,
    date: asLocalized(review.created_at.slice(0, 10)),
    text: asLocalized(review.comment ?? ""),
  }));

  return mapVendorRow(row, {
    packages,
    highlights,
    bookedDates,
    reviews,
    capacity: venue?.capacity_max ?? location?.capacity ?? undefined,
    sizes: sizes.length > 0 ? Array.from(new Set(sizes)) : undefined,
    startingPrice: Number(
      venue?.price_per_event ??
        location?.hourly_rate ??
        packages[0]?.price ??
        row.price_starting_at ??
        0,
    ),
  });
}
