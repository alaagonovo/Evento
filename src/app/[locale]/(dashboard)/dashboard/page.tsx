import { getAuthUser } from "@/lib/supabase/server";
import { getProfileById } from "@/modules/users";
import { BecomeVendorCard, getVendorByProfileId } from "@/modules/vendors";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();
  const profile = user ? await getProfileById(user.id) : null;
  const vendor =
    user && profile?.role === "customer" ? await getVendorByProfileId(user.id) : null;
  const canBecomeVendor = profile?.role === "customer" && !vendor;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.dashboard.overview}</CardTitle>
          <CardDescription>
            {dictionary.dashboard.customerIntro} {dictionary.dashboard.comingSoon}
          </CardDescription>
        </CardHeader>
      </Card>
      {canBecomeVendor ? <BecomeVendorCard locale={locale} dictionary={dictionary} /> : null}
    </div>
  );
}
