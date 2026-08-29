"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import type { Dictionary } from "@/shared/lib/i18n";
import { deleteVendorUserAction } from "../services/actions";

export function DeleteVendorButton({
  vendorId,
  businessName,
  locale,
  dictionary,
}: {
  vendorId: string;
  businessName: string;
  locale: string;
  dictionary: Dictionary;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  const copy = dictionary.admin;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setFailed(false);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="destructive">
          {copy.ban}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{copy.deleteConfirmTitle.replace("{name}", businessName)}</DialogTitle>
          <DialogDescription>{copy.deleteConfirmBody}</DialogDescription>
        </DialogHeader>
        {failed ? <p className="text-sm text-destructive">{copy.deleteFailed}</p> : null}
        <DialogFooter className="mx-0 mb-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={pending}>
              {copy.cancel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={() => {
              setFailed(false);
              startTransition(async () => {
                const result = await deleteVendorUserAction(vendorId, locale);
                if (result?.ok) {
                  setOpen(false);
                  router.refresh();
                  return;
                }
                setFailed(true);
              });
            }}
          >
            {pending ? dictionary.common.loading : copy.deleteConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
