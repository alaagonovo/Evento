import { Sparkles } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import { listFeaturedVendors } from "../services/vendors";
import { VendorCard } from "./vendor-card";

type FeaturedVendorsProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export async function FeaturedVendors({ locale, dictionary }: FeaturedVendorsProps) {
  const vendors = (await listFeaturedVendors()).slice(0, 3);

  if (vendors.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="size-6" />}
        title={dictionary.home.featuredEmpty}
        description={dictionary.home.featuredEmptyHint}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          locale={locale}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
}
