import { notFound, redirect } from "next/navigation";
import { BookingCheckout } from "@/modules/bookings";
import { getAuthUser } from "@/lib/supabase/server";
import { getApprovedVendorById } from "@/modules/vendors";
import { Container } from "@/shared/components/container";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";
import { isBeforeMinBookableDate } from "@/modules/vendors/lib/booking-notice";

type BookingPageProps = {
  params: Promise<{ locale: string; vendorId: string }>;
  searchParams: Promise<{ date?: string }>;
};

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { locale: localeParam, vendorId } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();

  if (!user) {
    redirect(
      `${localizedPath(locale, "/login")}?next=${encodeURIComponent(`/booking/${vendorId}`)}`,
    );
  }

  const vendor = await getApprovedVendorById(vendorId);
  if (!vendor) {
    notFound();
  }

  const { date } = await searchParams;
  const initialDate = date && !isBeforeMinBookableDate(date) ? date : undefined;

  return (
    <Container className="py-8 sm:py-10">
      <BookingCheckout
        vendor={vendor}
        locale={locale}
        dictionary={dictionary}
        initialDate={initialDate}
      />
    </Container>
  );
}
