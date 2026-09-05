"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import type { Dictionary, Locale } from "@/shared/lib/i18n";
import { respondToBookingAction } from "../services/actions";
import type { BookingResponse } from "../types/booking";

export function VendorBookingActions({
  bookingId,
  locale,
  dictionary,
  allowAccept = true,
}: {
  bookingId: string;
  locale: Locale;
  dictionary: Dictionary;
  allowAccept?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState<"accept" | "cancel" | null>(null);

  function respond(nextStatus: BookingResponse) {
    setFailed(null);
    startTransition(async () => {
      const result = await respondToBookingAction(bookingId, nextStatus, locale);
      if (result.ok) {
        router.refresh();
        return;
      }
      setFailed(nextStatus === "confirmed" ? "accept" : "cancel");
    });
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {allowAccept ? (
          <Button type="button" size="sm" disabled={pending} onClick={() => respond("confirmed")}>
            {pending ? dictionary.common.loading : dictionary.booking.accept}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => respond("cancelled")}
        >
          {pending && !allowAccept ? dictionary.common.loading : dictionary.booking.cancelRequest}
        </Button>
      </div>
      {failed ? (
        <p className="text-xs text-destructive">
          {failed === "accept" ? dictionary.booking.acceptFailed : dictionary.booking.cancelFailed}
        </p>
      ) : null}
    </div>
  );
}
