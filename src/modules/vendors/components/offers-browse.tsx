import { Percent } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import { listOfferCategories, listOffers } from "../data/mock";
import type { VendorCategorySlug } from "../types/category";
import { OfferCard } from "./offer-card";
import { OfferCategoryFilter } from "./offer-category-filter";

type OffersBrowseProps = {
  locale: Locale;
  dictionary: Dictionary;
  category?: VendorCategorySlug;
};

export function OffersBrowse({ locale, dictionary, category }: OffersBrowseProps) {
  const offers = listOffers(category);
  const categories = listOfferCategories();

  return (
    <div className="space-y-8">
      <OfferCategoryFilter
        locale={locale}
        dictionary={dictionary}
        categories={categories}
        selected={category}
      />
      {offers.length === 0 ? (
        <EmptyState
          icon={<Percent className="size-6" />}
          title={dictionary.offers.emptyTitle}
          description={dictionary.offers.emptyHint}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} locale={locale} dictionary={dictionary} />
          ))}
        </div>
      )}
    </div>
  );
}
