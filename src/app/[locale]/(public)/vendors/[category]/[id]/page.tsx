import { notFound } from "next/navigation";
import {
  getApprovedVendorById,
  isVendorCategorySlug,
  VendorDetailView,
} from "@/modules/vendors";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

type VendorDetailPageProps = {
  params: Promise<{ locale: string; category: string; id: string }>;
};

export default async function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { locale: localeParam, category, id } = await params;
  const locale = parseLocale(localeParam);

  if (!isVendorCategorySlug(category)) {
    notFound();
  }

  const vendor = await getApprovedVendorById(id);

  if (!vendor || vendor.category !== category) {
    notFound();
  }

  return (
    <VendorDetailView
      vendor={vendor}
      locale={locale}
      dictionary={getDictionary(locale)}
    />
  );
}
