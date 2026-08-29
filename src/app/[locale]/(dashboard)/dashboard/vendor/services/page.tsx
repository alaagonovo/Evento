import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { getVendorByProfileId } from "@/modules/vendors";
import { PlaceholderPage } from "@/shared/components/placeholder-page";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function VendorServicesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();

  if (!user) {
    redirect(localizedPath(locale, "/login"));
  }

  const vendor = await getVendorByProfileId(user.id);
  if (!vendor?.isApproved) {
    redirect(localizedPath(locale, "/dashboard/vendor"));
  }

  return (
    <PlaceholderPage
      title={dictionary.dashboard.vendorServices}
      description={`${dictionary.dashboard.vendorIntro} ${dictionary.dashboard.comingSoon}`}
    />
  );
}
