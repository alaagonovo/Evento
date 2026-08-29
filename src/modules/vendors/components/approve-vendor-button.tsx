"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { approveVendorAction } from "../services/actions";

export function ApproveVendorButton({
  vendorId,
  locale,
  label,
  failedLabel,
  loadingLabel,
  onApproved,
}: {
  vendorId: string;
  locale: string;
  label: string;
  failedLabel: string;
  loadingLabel: string;
  onApproved?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() => {
          setFailed(false);
          startTransition(async () => {
            const result = await approveVendorAction(vendorId, locale);
            if (result?.ok) {
              onApproved?.();
              router.refresh();
              return;
            }
            setFailed(true);
          });
        }}
      >
        {pending ? loadingLabel : label}
      </Button>
      {failed ? <p className="text-xs text-destructive">{failedLabel}</p> : null}
    </div>
  );
}
