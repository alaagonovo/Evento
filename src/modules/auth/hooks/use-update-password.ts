"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updatePasswordAction } from "../services/auth-actions";
import type { AuthErrorKey } from "../services/auth-errors";
import { updatePasswordSchema, type UpdatePasswordInput } from "../types/auth";
import type { Dictionary } from "@/shared/lib/i18n";

export function useUpdatePassword(afterHref: string, dictionary: Dictionary["auth"]) {
  const router = useRouter();
  const [errorKey, setErrorKey] = useState<AuthErrorKey | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<UpdatePasswordInput>({
    defaultValues: { password: "" },
  });

  function onSubmit(values: UpdatePasswordInput) {
    const parsed = updatePasswordSchema.safeParse(values);
    if (!parsed.success) {
      setErrorKey("genericError");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updatePasswordAction(parsed.data);
        if (!result.ok) {
          setErrorKey(result.errorKey);
          return;
        }
        router.replace(afterHref);
        router.refresh();
      } catch {
        setErrorKey("genericError");
      }
    });
  }

  return { form, onSubmit, pending, error: errorKey ? dictionary[errorKey] : null };
}
