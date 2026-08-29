import { createClient } from "@/lib/supabase/server";

export { getAuthUser } from "@/lib/supabase/server";

export async function signOutServer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
