import { AuthCard, SignUpForm, type IntendedRole } from "@/modules/auth";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string }>;
};

export default async function SignUpPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const { role } = await searchParams;
  const defaultRole: IntendedRole = role === "vendor" ? "vendor" : "customer";

  return (
    <AuthCard title={dictionary.auth.signUpTitle} subtitle={dictionary.auth.signUpSubtitle}>
      <SignUpForm key={defaultRole} locale={locale} dictionary={dictionary} defaultRole={defaultRole} />
    </AuthCard>
  );
}
