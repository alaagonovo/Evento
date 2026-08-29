import type { VariantProps } from "class-variance-authority";
import type { VendorStatus } from "@/lib/supabase/database.types";
import { Badge, badgeVariants } from "@/shared/components/ui/badge";
import type { Dictionary } from "@/shared/lib/i18n";

const STATUS_VARIANT: Record<
  VendorStatus,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  pending: "secondary",
  approved: "gold",
  rejected: "destructive",
  suspended: "outline",
};

export function vendorStatusLabel(status: VendorStatus, dictionary: Dictionary) {
  if (status === "approved") return dictionary.admin.approved;
  if (status === "rejected") return dictionary.admin.rejected;
  if (status === "suspended") return dictionary.admin.suspended;
  return dictionary.admin.pending;
}

export function VendorStatusBadge({
  status,
  dictionary,
}: {
  status: VendorStatus;
  dictionary: Dictionary;
}) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {vendorStatusLabel(status, dictionary)}
    </Badge>
  );
}
