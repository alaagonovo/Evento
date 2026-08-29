import { HomeReviews } from "@/modules/reviews";
import { HomeLanding } from "@/modules/vendors";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <>
      <HomeLanding locale={locale} dictionary={dictionary} />
      <HomeReviews locale={locale} dictionary={dictionary} />
    </>
  );
}
