import Link from "next/link";
import { getAuthUser } from "@/lib/supabase/server";
import { getProfileById } from "@/modules/users";
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
  const isVendor = profile?.role === "vendor";

  const links = isVendor
    ? [
        {
          href: localizedPath(locale, "/dashboard/vendor"),
          label: dictionary.dashboard.vendorHome,
        },
        {
          href: localizedPath(locale, "/dashboard/bookings"),
          label: dictionary.dashboard.bookings,
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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
