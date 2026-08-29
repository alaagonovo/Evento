"use client";

import { useState } from "react";
import { VendorGallery } from "./vendor-gallery";
import { DressOptions } from "./dress-options";
import type { DressAngle } from "../data/mock";
import type { VendorView } from "../types/vendor";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";

type VendorMediaBlockProps = {
  vendor: VendorView;
  locale: Locale;
  dictionary: Dictionary;
};

export function VendorMediaBlock({ vendor, locale, dictionary }: VendorMediaBlockProps) {
  const [angle, setAngle] = useState<DressAngle | "all">("all");
  const isDress = vendor.category === "dresses";

  return (
    <div className="space-y-4">
      <VendorGallery
        key={angle}
        photos={vendor.gallery}
        locale={locale}
        dictionary={dictionary}
        activeAngle={isDress ? angle : "all"}
      />
      {isDress && vendor.sizes ? (
        <DressOptions
          sizes={vendor.sizes}
          dictionary={dictionary}
          onAngleChange={setAngle}
        />
      ) : null}
    </div>
  );
}
