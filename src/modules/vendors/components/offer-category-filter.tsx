import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import type { VendorCategorySlug } from "../types/category";

type OfferCategoryFilterProps = {
  locale: Locale;
  dictionary: Dictionary;
  categories: VendorCategorySlug[];
  selected?: VendorCategorySlug;
};

export function OfferCategoryFilter({
  locale,
  dictionary,
  categories,
  selected,
}: OfferCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={dictionary.offers.filterCategory}>
      <Button asChild size="sm" variant={selected ? "outline" : "gold"}>
        <Link href={localizedPath(locale, "/offers")} aria-current={!selected ? "page" : undefined}>
          {dictionary.offers.allCategories}
        </Link>
      </Button>
      {categories.map((slug) => {
        const active = selected === slug;
        return (
          <Button key={slug} asChild size="sm" variant={active ? "gold" : "outline"}>
            <Link
              href={localizedPath(locale, `/offers?category=${slug}`)}
              aria-current={active ? "page" : undefined}
            >
              {dictionary.categories[slug].title}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
