"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signInWithPasswordAction } from "../services/auth-actions";
import type { AuthErrorKey } from "../services/auth-errors";
import { signInSchema, type SignInInput } from "../types/auth";
import type { Dictionary } from "@/shared/lib/i18n";

export function useSignIn(afterPath: string, dictionary: Dictionary["auth"]) {
  const router = useRouter();
  const [errorKey, setErrorKey] = useState<AuthErrorKey | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<SignInInput>({
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignInInput) {
    const parsed = signInSchema.safeParse(values);
    if (!parsed.success) {
      setErrorKey("invalidCredentials");
      return;
    }

    startTransition(async () => {
      try {
        const result = await signInWithPasswordAction(parsed.data);
        if (!result.ok) {
          setErrorKey(result.errorKey);
          return;
        }
        router.replace(afterPath);
        router.refresh();
      } catch {
        setErrorKey("genericError");
      }
    });
  }

  return { form, onSubmit, pending, error: errorKey ? dictionary[errorKey] : null };
}
