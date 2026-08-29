import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Dictionary } from "@/shared/lib/i18n";
import type { VendorAccount } from "../services/vendor-account";

export function VendorStatusBanner({
  vendor,
  dictionary,
}: {
  vendor: VendorAccount;
  dictionary: Dictionary;
}) {
  const copy = dictionary.onboarding;
  const title =
    vendor.status === "rejected"
      ? copy.rejectedTitle
      : vendor.status === "approved"
        ? vendor.businessName
        : copy.pendingTitle;
  const body =
    vendor.status === "rejected"
      ? copy.rejectedBody
      : vendor.status === "approved"
        ? copy.approvedBody
        : copy.pendingBody;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardHeader>
      {vendor.status !== "approved" ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">{vendor.businessName}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
