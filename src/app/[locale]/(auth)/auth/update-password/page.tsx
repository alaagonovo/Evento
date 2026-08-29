import { AuthCard, UpdatePasswordForm } from "@/modules/auth";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function UpdatePasswordPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <AuthCard
      title={dictionary.auth.updatePasswordTitle}
      subtitle={dictionary.auth.forgotSubtitle}
    >
      <UpdatePasswordForm
        afterHref={localizedPath(locale, "/auth/redirect")}
        dictionary={dictionary}
      />
    </AuthCard>
  );
}
