import { VENDOR_CATEGORY_SLUGS, CategoryGrid } from "@/modules/vendors";
import { Container } from "@/shared/components/container";
import { getDictionary, localizedPath, parseLocale } from "@/shared/lib/i18n";

type CategoriesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <Container className="space-y-10 py-10">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl">{dictionary.vendors.allCategories}</h1>
        <p className="text-muted-foreground">{dictionary.vendors.allCategoriesSubtitle}</p>
      </header>
      <CategoryGrid
        categories={VENDOR_CATEGORY_SLUGS.map((slug) => ({
          slug,
          title: dictionary.categories[slug].title,
          description: dictionary.categories[slug].description,
          href: localizedPath(locale, `/vendors/${slug}`),
        }))}
      />
    </Container>
  );
}
