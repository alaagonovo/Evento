"use client";

import { useState } from "react";
import type { Dictionary, Locale } from "@/shared/lib/i18n";
import type { VendorStatus } from "@/lib/supabase/database.types";
import { ApproveVendorButton } from "./approve-vendor-button";
import { DeleteVendorButton } from "./delete-vendor-button";

export function VendorAdminActions({
  vendorId,
  businessName,
  status,
  locale,
  dictionary,
}: {
  vendorId: string;
  businessName: string;
  status: VendorStatus;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [approved, setApproved] = useState(status === "approved");

  if (approved) {
    return (
      <DeleteVendorButton
        vendorId={vendorId}
        businessName={businessName}
        locale={locale}
        dictionary={dictionary}
      />
    );
  }

  return (
    <ApproveVendorButton
      vendorId={vendorId}
      locale={locale}
      label={dictionary.admin.approve}
      failedLabel={dictionary.admin.approveFailed}
      loadingLabel={dictionary.common.loading}
      onApproved={() => setApproved(true)}
    />
  );
}
