import { redirect } from "next/navigation";
import { AuthCard } from "@/modules/auth";
import { getAuthUser } from "@/lib/supabase/server";
import { getVendorByProfileId, VendorOnboardingForm } from "@/modules/vendors";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function VendorOnboardingPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();

  if (!user) {
    redirect(localizedPath(locale, "/login"));
  }

  const vendor = await getVendorByProfileId(user.id);
  if (vendor) {
    redirect(localizedPath(locale, "/dashboard/vendor"));
  }

  return (
    <AuthCard
      className="max-w-lg"
      title={dictionary.onboarding.title}
      subtitle={dictionary.onboarding.stepDetails}
    >
      <VendorOnboardingForm locale={locale} dictionary={dictionary} />
    </AuthCard>
  );
}
