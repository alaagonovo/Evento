import { VendorBrowseGrid, cityLabel, parseCategoryQuery } from "@/modules/vendors";
import { Badge } from "@/shared/components/ui/badge";
import { Container } from "@/shared/components/container";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type VendorsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string | string[];
    city?: string;
    date?: string;
    lat?: string;
    lng?: string;
  }>;
};

export default async function VendorsPage({ params, searchParams }: VendorsPageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const { category, city, date, lat: latParam, lng: lngParam } = await searchParams;
  const categories = parseCategoryQuery(category);
  const lat = latParam ? Number(latParam) : undefined;
  const lng = lngParam ? Number(lngParam) : undefined;
  const nearMe = Number.isFinite(lat) && Number.isFinite(lng);
  const hasFilters = categories.length > 0 || Boolean(city) || Boolean(date) || nearMe;

  return (
    <Container className="space-y-10 py-10">
      <header className="max-w-3xl space-y-3">
        <h1 className="font-heading text-3xl sm:text-4xl">{dictionary.vendors.title}</h1>
        {hasFilters ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((slug) => (
              <Badge key={slug} variant="secondary">
                {dictionary.categories[slug].title}
              </Badge>
            ))}
            {nearMe ? <Badge variant="outline">{dictionary.home.searchCurrentLocation}</Badge> : null}
            {city && !nearMe ? <Badge variant="outline">{cityLabel(city, dictionary)}</Badge> : null}
            {date ? <Badge variant="outline">{date}</Badge> : null}
          </div>
        ) : (
          <p className="text-muted-foreground">{dictionary.vendors.subtitle}</p>
        )}
      </header>
      <VendorBrowseGrid
        locale={locale}
        dictionary={dictionary}
        categories={categories}
        city={nearMe ? undefined : city}
        lat={nearMe ? lat : undefined}
        lng={nearMe ? lng : undefined}
      />
    </Container>
  );
}
