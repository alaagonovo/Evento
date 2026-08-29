import type { Dictionary, Locale } from "@/shared/lib/i18n";
import { isVendorType, VENDOR_TYPE_TO_CATEGORY } from "../types/category";
import { cityLabel } from "../lib/city-label";
import type { AdminVendorApplication } from "../services/vendor-account";
import { VendorAdminActions } from "./vendor-admin-actions";
import { VendorApplicationDialog } from "./vendor-application-dialog";
import { VendorStatusBadge } from "./vendor-status-badge";

export function AdminVendorTable({
  vendors,
  dictionary,
  locale,
}: {
  vendors: AdminVendorApplication[];
  dictionary: Dictionary;
  locale: Locale;
}) {
  if (vendors.length === 0) {
    return <p className="text-sm text-muted-foreground">{dictionary.empty.title}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[36rem] text-center text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">
              {dictionary.onboarding.businessName}
            </th>
            <th className="px-4 py-3 font-medium">{dictionary.onboarding.category}</th>
            <th className="px-4 py-3 font-medium">{dictionary.onboarding.city}</th>
            <th className="px-4 py-3 font-medium">{dictionary.admin.status}</th>
            <th className="px-4 py-3 font-medium">{dictionary.admin.actions}</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => {
            const categorySlug = isVendorType(vendor.category)
              ? VENDOR_TYPE_TO_CATEGORY[vendor.category]
              : "venues";

            return (
              <tr key={vendor.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{vendor.business_name}</td>
                <td className="px-4 py-3">{dictionary.categories[categorySlug].title}</td>
                <td className="px-4 py-3">{cityLabel(vendor.city, dictionary)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <VendorStatusBadge status={vendor.status} dictionary={dictionary} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <VendorApplicationDialog
                      vendor={vendor}
                      dictionary={dictionary}
                      locale={locale}
                    />
                    <VendorAdminActions
                      vendorId={vendor.id}
                      businessName={vendor.business_name}
                      status={vendor.status}
                      locale={locale}
                      dictionary={dictionary}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
