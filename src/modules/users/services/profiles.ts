import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/database.types";

export type Profile = {
  id: string;
  role: UserRole;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, role, email, full_name, phone, avatar_url, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    role: data.role,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
  };
}

export async function promoteCustomerToVendor(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: "vendor" })
    .eq("id", userId)
    .eq("role", "customer");

  if (error) {
    throw new Error(error.message);
  }
}
