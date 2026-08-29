import { Search } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import { listApprovedVendors } from "../services/vendors";
import type { VendorCategorySlug } from "../types/category";
import { VendorCard } from "./vendor-card";

type VendorBrowseGridProps = {
  locale: Locale;
  dictionary: Dictionary;
  category?: VendorCategorySlug;
  categories?: VendorCategorySlug[];
  city?: string;
  lat?: number;
  lng?: number;
};

export async function VendorBrowseGrid({
  locale,
  dictionary,
  category,
  categories,
  city,
  lat,
  lng,
}: VendorBrowseGridProps) {
  const vendors = await listApprovedVendors({ category, categories, city, lat, lng, limit: 24 });

  if (vendors.length === 0) {
    return (
      <EmptyState
        icon={<Search className="size-6" />}
        title={dictionary.empty.searchTitle}
        description={dictionary.empty.searchHint}
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
