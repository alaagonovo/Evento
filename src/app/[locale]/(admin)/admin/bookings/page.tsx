import { PlaceholderPage } from "@/shared/components/placeholder-page";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBookingsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <PlaceholderPage
      title={dictionary.admin.bookings}
      description={dictionary.admin.comingSoon}
    />
  );
}
