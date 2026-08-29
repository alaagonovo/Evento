import { AuthCard, ForgotPasswordForm } from "@/modules/auth";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <AuthCard title={dictionary.auth.forgotTitle} subtitle={dictionary.auth.forgotSubtitle}>
      <ForgotPasswordForm locale={locale} dictionary={dictionary} />
    </AuthCard>
  );
}
