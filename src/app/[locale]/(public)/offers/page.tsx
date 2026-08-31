import { OffersBrowse, parseCategoryQuery } from "@/modules/vendors";
import { Container } from "@/shared/components/container";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type OffersPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function OffersPage({ params, searchParams }: OffersPageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const { category } = await searchParams;
  const selected = parseCategoryQuery(category)[0];

  return (
    <Container className="space-y-10 py-10">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl">{dictionary.offers.title}</h1>
        <p className="text-muted-foreground">{dictionary.offers.subtitle}</p>
      </header>
      <OffersBrowse locale={locale} dictionary={dictionary} category={selected} />
    </Container>
  );
}
