import Link from "next/link";
import { getAuthUser } from "@/lib/supabase/server";
import { countPendingVendorBookings } from "@/modules/bookings";
import { getProfileById } from "@/modules/users";
import { getVendorByProfileId } from "@/modules/vendors";
import { SiteHeader } from "@/shared/components/site-header";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardGroupLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();
  const profile = user ? await getProfileById(user.id) : null;
  const vendorAccount = user ? await getVendorByProfileId(user.id) : null;
  const isVendor = profile?.role === "vendor" || Boolean(vendorAccount);
  const vendor = isVendor ? vendorAccount : null;
  const pendingRequests = vendor ? await countPendingVendorBookings(vendor.id) : 0;

  const links = isVendor
    ? [
        {
          href: localizedPath(locale, "/dashboard/vendor"),
          label: dictionary.dashboard.vendorHome,
        },
        {
          href: localizedPath(locale, "/dashboard/bookings"),
          label: dictionary.dashboard.bookings,
          badge: pendingRequests,
        },
        {
          href: localizedPath(locale, "/dashboard/vendor/services"),
          label: dictionary.dashboard.vendorServices,
        },
        {
          href: localizedPath(locale, "/dashboard/vendor/availability"),
          label: dictionary.dashboard.vendorAvailability,
        },
        {
          href: localizedPath(locale, "/dashboard/profile"),
          label: dictionary.dashboard.profile,
        },
      ]
    : [
        { href: localizedPath(locale, "/dashboard"), label: dictionary.dashboard.overview },
        {
          href: localizedPath(locale, "/dashboard/bookings"),
          label: dictionary.dashboard.bookings,
        },
        {
          href: localizedPath(locale, "/dashboard/profile"),
          label: dictionary.dashboard.profile,
        },
      ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <nav className="flex flex-row flex-wrap gap-2 md:flex-col">
            {links.map((link) => {
              const badge = "badge" in link ? link.badge : 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span>{link.label}</span>
                  {badge ? (
                    <span
                      className="relative inline-flex"
                      aria-label={dictionary.booking.pendingCount.replace("{count}", String(badge))}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 animate-ping rounded-full bg-gold/70"
                      />
                      <span className="relative inline-flex min-w-5 animate-pulse items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-semibold leading-5 text-gold-foreground">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
