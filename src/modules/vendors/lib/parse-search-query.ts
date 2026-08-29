import { isVendorCategorySlug, type VendorCategorySlug } from "../types/category";

export function parseCategoryQuery(
  value: string | string[] | undefined,
): VendorCategorySlug[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];

  return [
    ...new Set(
      raw.flatMap((item) => item.split(",")).map((item) => item.trim()),
    ),
  ].filter(isVendorCategorySlug);
}
