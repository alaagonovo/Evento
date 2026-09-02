"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { isCloudinaryImageUrl } from "@/shared/lib/cloudinary";

const avatarUrlSchema = z
  .string()
  .url()
  .refine(isCloudinaryImageUrl, { message: "Invalid image URL" });

export async function updateProfileAvatar(url: string) {
  const parsed = avatarUrlSchema.safeParse(url);
  if (!parsed.success) {
    return { ok: false as const };
  }

  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: parsed.data })
    .eq("id", user.id);

  if (error) {
    return { ok: false as const };
  }

  revalidatePath("/", "layout");
  return { ok: true as const };
}
