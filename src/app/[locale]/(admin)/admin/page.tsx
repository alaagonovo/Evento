import { PlaceholderPage } from "@/shared/components/placeholder-page";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <PlaceholderPage
      title={dictionary.admin.overview}
      description={`${dictionary.admin.intro} ${dictionary.admin.comingSoon}`}
    />
  );
}
