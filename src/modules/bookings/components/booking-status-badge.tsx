import type { VariantProps } from "class-variance-authority";
import type { BookingStatus } from "@/lib/supabase/database.types";
import { Badge, badgeVariants } from "@/shared/components/ui/badge";
import type { Dictionary } from "@/shared/lib/i18n";

const STATUS_VARIANT: Record<
  BookingStatus,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  pending: "secondary",
  confirmed: "gold",
  cancelled: "destructive",
};

export function bookingStatusLabel(status: BookingStatus, dictionary: Dictionary) {
  return dictionary.booking.statuses[status];
}

export function BookingStatusBadge({
  status,
  dictionary,
}: {
  status: BookingStatus;
  dictionary: Dictionary;
}) {
  return <Badge variant={STATUS_VARIANT[status]}>{bookingStatusLabel(status, dictionary)}</Badge>;
}
