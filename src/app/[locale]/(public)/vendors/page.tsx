import { VENDOR_CATEGORY_SLUGS, VendorBrowseGrid, CategoryGrid } from "@/modules/vendors";
import { Container } from "@/shared/components/container";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type VendorsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ city?: string }>;
};

export default async function VendorsPage({ params, searchParams }: VendorsPageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const { city } = await searchParams;

  return (
    <Container className="space-y-10 py-10">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl">{dictionary.vendors.title}</h1>
        <p className="text-muted-foreground">
          {dictionary.vendors.filters}: {dictionary.vendors.category}, {dictionary.vendors.city}
        </p>
      </header>
      <CategoryGrid
        categories={VENDOR_CATEGORY_SLUGS.map((slug) => ({
          slug,
          title: dictionary.categories[slug].title,
          description: dictionary.categories[slug].description,
          href: localizedPath(locale, `/vendors/${slug}`),
        }))}
      />
      <VendorBrowseGrid locale={locale} dictionary={dictionary} city={city} />
    </Container>
  );
}
