"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { requestPasswordResetAction } from "../services/auth-actions";
import type { AuthErrorKey } from "../services/auth-errors";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../types/auth";
import type { Dictionary } from "@/shared/lib/i18n";

export function useForgotPassword(locale: string, dictionary: Dictionary["auth"]) {
  const [errorKey, setErrorKey] = useState<AuthErrorKey | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordInput>({
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    const parsed = forgotPasswordSchema.safeParse(values);
    if (!parsed.success) {
      setErrorKey("genericError");
      return;
    }

    startTransition(async () => {
      try {
        const redirectTo = `${window.location.origin}/${locale}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`;
        const result = await requestPasswordResetAction(parsed.data, redirectTo);
        if (!result.ok) {
          setErrorKey(result.errorKey);
          return;
        }
        setSent(true);
      } catch {
        setErrorKey("genericError");
      }
    });
  }

  return { form, onSubmit, pending, sent, error: errorKey ? dictionary[errorKey] : null };
}
