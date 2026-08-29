import {
  AuthCard,
  SignInForm,
} from "@/modules/auth";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const { next } = await searchParams;

  return (
    <AuthCard title={dictionary.auth.signInTitle} subtitle={dictionary.auth.signInSubtitle}>
      <SignInForm locale={locale} dictionary={dictionary} nextPath={next} />
    </AuthCard>
  );
}
