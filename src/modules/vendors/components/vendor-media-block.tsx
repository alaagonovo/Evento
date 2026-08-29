"use client";

import { VendorGallery } from "./vendor-gallery";
import type { VendorView } from "../types/vendor";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";

type VendorMediaBlockProps = {
  vendor: VendorView;
  locale: Locale;
  dictionary: Dictionary;
};

export function VendorMediaBlock({ vendor, locale, dictionary }: VendorMediaBlockProps) {
  return (
    <div className="space-y-4">
      <VendorGallery
        photos={vendor.gallery}
        locale={locale}
        dictionary={dictionary}
        activeAngle="all"
      />
    </div>
  );
}
