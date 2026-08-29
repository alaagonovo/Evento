import { createClient } from "@/lib/supabase/server";
import type { VendorStatus } from "@/lib/supabase/database.types";
import type { VendorType } from "../types/category";
import { resolveGoogleMapsLocation } from "../lib/parse-google-maps-location";
import { parseVendorOnboarding, type VendorOnboardingInput } from "./onboarding-schema";

export type { VendorOnboardingInput, VendorOnboardingPayload } from "./onboarding-schema";
export { parseVendorOnboarding } from "./onboarding-schema";

export type VendorAccount = {
  id: string;
  profileId: string;
  status: VendorStatus;
  businessName: string;
  isApproved: boolean;
};

export async function getVendorByProfileId(
  profileId: string,
): Promise<VendorAccount | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vendors")
    .select("id, profile_id, status, business_name, is_approved")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    profileId: data.profile_id,
    status: data.status,
    businessName: data.business_name,
    isApproved: data.is_approved,
  };
}

export async function createVendorListing(
  profileId: string,
  input: VendorOnboardingInput,
) {
  const parsed = parseVendorOnboarding(input);
  const coords = await resolveGoogleMapsLocation(parsed.locationLink);
  if (!coords) {
    throw new Error("Invalid Google Maps location link");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("vendors").insert({
    profile_id: profileId,
    category: parsed.category,
    business_name: parsed.businessName,
    city: parsed.city,
    address: parsed.address,
    description: parsed.description,
    cover_image: parsed.coverImage,
    latitude: coords.latitude,
    longitude: coords.longitude,
    gallery_images: parsed.galleryImages,
    price_starting_at: parsed.priceStartingAt,
    status: "pending",
    is_approved: false,
    is_verified: false,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export type AdminVendorApplication = {
  id: string;
  business_name: string;
  category: VendorType;
  city: string;
  address: string | null;
  description: string | null;
  cover_image: string | null;
  gallery_images: string[];
  price_starting_at: number | null;
  latitude: number | null;
  longitude: number | null;
  status: VendorStatus;
  is_approved: boolean;
  created_at: string;
};

export async function listVendorsForAdmin(): Promise<AdminVendorApplication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select(
      "id, business_name, category, city, address, description, cover_image, gallery_images, price_starting_at, latitude, longitude, status, is_approved, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function approveVendor(vendorId: string) {
  const supabase = await createClient();
  const { error: rpcError } = await supabase.rpc("approve_vendor", { vendor_id: vendorId });

  if (!rpcError) return;

  const rpcMissing = /could not find the function/i.test(rpcError.message);
  if (!rpcMissing) {
    throw new Error(rpcError.message);
  }

  const { data, error } = await supabase
    .from("vendors")
    .update({ status: "approved", is_approved: true })
    .eq("id", vendorId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Vendor was not updated");
  }
}

export async function deleteVendorUser(vendorId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_vendor_user", {
    target_vendor_id: vendorId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export type { VendorType };
