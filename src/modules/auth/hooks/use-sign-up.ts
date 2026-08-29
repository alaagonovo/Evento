"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signUpWithPasswordAction } from "../services/auth-actions";
import { duplicateEmailErrorKey, type AuthErrorKey } from "../services/auth-errors";
import { signUpSchema, type SignUpInput } from "../types/auth";
import { useCheckEmailExists } from "./use-check-email-exists";
import type { Dictionary } from "@/shared/lib/i18n";

export function useSignUp(
  locale: string,
  continueHref: string,
  dictionary: Dictionary["auth"],
  defaultRole: SignUpInput["intendedRole"] = "customer",
) {
  const router = useRouter();
  const { check: checkEmailExists } = useCheckEmailExists();
  const [errorKey, setErrorKey] = useState<AuthErrorKey | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<SignUpInput>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      intendedRole: defaultRole,
    },
  });

  async function verifyEmailAvailable(email: string, role: SignUpInput["intendedRole"]) {
    const parsedEmail = signUpSchema.shape.email.safeParse(email);
    if (!parsedEmail.success) {
      return true;
    }

    const exists = await checkEmailExists(parsedEmail.data);
    if (exists === true) {
      setErrorKey(duplicateEmailErrorKey(role));
      return false;
    }

    if (errorKey === "emailTaken" || errorKey === "emailTakenVendor") {
      setErrorKey(null);
    }

    return true;
  }

  async function onEmailBlur() {
    const email = form.getValues("email");
    const role = form.getValues("intendedRole");
    await verifyEmailAvailable(email, role);
  }

  function onSubmit(values: SignUpInput) {
    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      setErrorKey("genericError");
      return;
    }

    startTransition(async () => {
      try {
        const available = await verifyEmailAvailable(parsed.data.email, parsed.data.intendedRole);
        if (!available) {
          return;
        }

        const redirectTo = `${window.location.origin}/${locale}/auth/callback`;
        const result = await signUpWithPasswordAction(parsed.data, redirectTo, locale);
        if (!result.ok) {
          setErrorKey(result.errorKey);
          return;
        }
        if (result.needsEmailConfirmation) {
          setCheckEmail(true);
          return;
        }
        router.replace(continueHref);
        router.refresh();
      } catch {
        setErrorKey("genericError");
      }
    });
  }

  return {
    form,
    onSubmit,
    onEmailBlur,
    pending,
    checkEmail,
    errorKey,
    error: errorKey && errorKey !== "emailTaken" && errorKey !== "emailTakenVendor" ? dictionary[errorKey] : null,
  };
}
