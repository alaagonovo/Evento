import { notFound } from "next/navigation";
import { isVendorCategorySlug, VendorBrowseGrid } from "@/modules/vendors";
import { Container } from "@/shared/components/container";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type CategoryPageProps = {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ city?: string; date?: string }>;
};

export default async function VendorCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { locale: localeParam, category } = await params;
  const locale = parseLocale(localeParam);

  if (!isVendorCategorySlug(category)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const copy = dictionary.categories[category];
  const { city } = await searchParams;

  return (
    <Container className="space-y-8 py-10">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </header>
      <VendorBrowseGrid
        locale={locale}
        dictionary={dictionary}
        category={category}
        city={city}
      />
    </Container>
  );
}
