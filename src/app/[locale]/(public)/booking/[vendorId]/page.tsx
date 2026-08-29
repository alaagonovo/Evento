import { PlaceholderPage } from "@/shared/components/placeholder-page";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type BookingPageProps = {
  params: Promise<{ locale: string; vendorId: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { locale: localeParam, vendorId } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <PlaceholderPage
      title={`${dictionary.booking.title} · ${vendorId}`}
      description={dictionary.booking.comingSoon}
    />
  );
}
