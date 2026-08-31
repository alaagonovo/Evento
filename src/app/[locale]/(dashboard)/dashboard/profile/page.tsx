import { getAuthUser } from "@/lib/supabase/server";
import { getProfileById, ProfileView } from "@/modules/users";
import { EmptyState } from "@/shared/components/empty-state";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardProfilePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();
  const profile = user ? await getProfileById(user.id) : null;

  if (!profile) {
    return (
      <EmptyState
        title={dictionary.profile.title}
        description={dictionary.profile.unavailable}
      />
    );
  }

  return <ProfileView profile={profile} locale={locale} dictionary={dictionary} />;
}
