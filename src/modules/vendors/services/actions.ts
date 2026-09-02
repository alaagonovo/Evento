"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { getProfileById, promoteCustomerToVendor } from "@/modules/users";
import {
  approveVendor,
  createVendorListing,
  deleteVendorUser,
  getVendorByProfileId,
  type VendorOnboardingInput,
} from "./vendor-account";

export async function submitVendorOnboarding(
  locale: string,
  input: VendorOnboardingInput,
) {
  const user = await getAuthUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const profile = await getProfileById(user.id);
  if (!profile || profile.role === "admin") {
    return { ok: false as const };
  }

  const existing = await getVendorByProfileId(user.id);
  if (existing) {
    redirect(`/${locale}/dashboard/vendor`);
  }

  try {
    await createVendorListing(user.id, input);
    if (profile.role === "customer") {
      await promoteCustomerToVendor(user.id);
    }
  } catch {
    return { ok: false as const };
  }

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/admin`, "layout");
  redirect(`/${locale}`);
}

export async function approveVendorAction(vendorId: string, locale: string) {
  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const };
  }

  const profile = await getProfileById(user.id);
  if (profile?.role !== "admin") {
    return { ok: false as const };
  }

  try {
    await approveVendor(vendorId);
  } catch {
    return { ok: false as const };
  }

  revalidatePath(`/${locale}/admin`, "layout");
  revalidatePath(`/${locale}/admin/vendors`);
  revalidatePath(`/${locale}/vendors`);
  return { ok: true as const };
}

export async function deleteVendorUserAction(vendorId: string, locale: string) {
  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const };
  }

  const profile = await getProfileById(user.id);
  if (profile?.role !== "admin") {
    return { ok: false as const };
  }

  try {
    await deleteVendorUser(vendorId);
  } catch {
    return { ok: false as const };
  }

  revalidatePath(`/${locale}/admin`, "layout");
  revalidatePath(`/${locale}/admin/vendors`);
  revalidatePath(`/${locale}/vendors`);
  return { ok: true as const };
}
