import { AuthHeader } from "@/shared/components/auth-header";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader locale={locale} dictionary={dictionary} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
