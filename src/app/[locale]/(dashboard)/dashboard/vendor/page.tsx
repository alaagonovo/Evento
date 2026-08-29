import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { getVendorByProfileId, VendorStatusBanner } from "@/modules/vendors";
import { PlaceholderPage } from "@/shared/components/placeholder-page";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function VendorDashboardPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();

  if (!user) {
    redirect(localizedPath(locale, "/login"));
  }

  const vendor = await getVendorByProfileId(user.id);
  if (!vendor) {
    redirect(localizedPath(locale, "/vendor/onboarding"));
  }

  return (
    <div className="space-y-6">
      <VendorStatusBanner vendor={vendor} dictionary={dictionary} />
      {vendor.isApproved ? (
        <PlaceholderPage
          title={dictionary.dashboard.vendorHome}
          description={dictionary.dashboard.vendorIntro}
        />
      ) : null}
    </div>
  );
}
