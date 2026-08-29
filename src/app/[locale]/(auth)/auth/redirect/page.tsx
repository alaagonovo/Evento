import { redirect } from "next/navigation";
import { getPostAuthPath } from "@/modules/auth";
import { getAuthUser } from "@/lib/supabase/server";
import { getProfileById } from "@/modules/users";
import { getVendorByProfileId } from "@/modules/vendors";
import { localizedPath, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; source?: string }>;
};

export default async function AuthRedirectPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const { next, source } = await searchParams;

  const user = await getAuthUser();
  if (!user) {
    redirect(localizedPath(locale, "/login"));
  }

  const profile = await getProfileById(user.id);
  const vendor =
    profile?.role === "vendor" ? await getVendorByProfileId(user.id) : null;

  const dest = getPostAuthPath({
    role: profile?.role ?? "customer",
    vendorStatus: vendor?.status ?? null,
    source: source === "confirm" ? "confirm" : "login",
    next,
  });

  redirect(localizedPath(locale, dest));
}
