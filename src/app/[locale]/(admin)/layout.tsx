import Link from "next/link";
import { SiteHeader } from "@/shared/components/site-header";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type AdminLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminGroupLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  const links = [
    { href: localizedPath(locale, "/admin"), label: dictionary.admin.overview },
    { href: localizedPath(locale, "/admin/vendors"), label: dictionary.admin.vendors },
    { href: localizedPath(locale, "/admin/bookings"), label: dictionary.admin.bookings },
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
