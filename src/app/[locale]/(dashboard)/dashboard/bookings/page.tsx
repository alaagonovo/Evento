import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import {
  CustomerBookingsList,
  VendorBookingsList,
  listCustomerBookings,
  listVendorBookings,
} from "@/modules/bookings";
import { getVendorByProfileId } from "@/modules/vendors";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardBookingsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();

  if (!user) {
    redirect(localizedPath(locale, "/login"));
  }

  const vendor = await getVendorByProfileId(user.id);
  const bookings = vendor
    ? await listVendorBookings(vendor.id)
    : await listCustomerBookings(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">
          {vendor ? dictionary.booking.requestsTitle : dictionary.dashboard.bookings}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {vendor ? dictionary.booking.vendorSubtitle : dictionary.booking.customerSubtitle}
        </p>
      </div>
      {vendor ? (
        <VendorBookingsList bookings={bookings} locale={locale} dictionary={dictionary} />
      ) : (
        <CustomerBookingsList bookings={bookings} locale={locale} dictionary={dictionary} />
      )}
    </div>
  );
}
