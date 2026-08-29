import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PublicLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({
  children,
  params,
}: PublicLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
