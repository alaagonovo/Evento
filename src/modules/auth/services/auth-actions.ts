"use server";

import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
  type ForgotPasswordInput,
  type SignInInput,
  type SignUpInput,
  type UpdatePasswordInput,
} from "../types/auth";
import { getAuthErrorMessage, duplicateEmailErrorKey, type AuthErrorKey } from "./auth-errors";
import { checkEmailExists, isDuplicateSignUpUser } from "./email-exists";

type AuthActionFailure = { ok: false; errorKey: AuthErrorKey };
type AuthActionSuccess = { ok: true; needsEmailConfirmation?: boolean };

async function withAuthClient<T extends AuthActionSuccess>(
  run: (supabase: Awaited<ReturnType<typeof createClient>>) => Promise<T | AuthActionFailure>,
): Promise<T | AuthActionFailure> {
  try {
    const supabase = await createClient();
    return await run(supabase);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return { ok: false, errorKey: getAuthErrorMessage(message) };
  }
}

export async function signInWithPasswordAction(
  input: SignInInput,
): Promise<AuthActionSuccess | AuthActionFailure> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errorKey: "invalidCredentials" };
  }

  return withAuthClient(async (supabase) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { ok: false, errorKey: getAuthErrorMessage(error.message) };
    }

    return { ok: true };
  });
}

export async function signUpWithPasswordAction(
  input: SignUpInput,
  redirectTo: string,
  locale = "ar",
): Promise<AuthActionSuccess | AuthActionFailure> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errorKey: "genericError" };
  }

  const emailLocale = locale === "en" ? "en" : "ar";

  return withAuthClient(async (supabase) => {
    const taken = await checkEmailExists(supabase, parsed.data.email);
    if (taken === true) {
      return { ok: false, errorKey: duplicateEmailErrorKey(parsed.data.intendedRole) };
    }

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: parsed.data.fullName,
          intended_role: parsed.data.intendedRole,
          locale: emailLocale,
        },
      },
    });

    if (error) {
      const mapped = getAuthErrorMessage(error.message);
      if (mapped === "emailTaken") {
        return { ok: false, errorKey: duplicateEmailErrorKey(parsed.data.intendedRole) };
      }
      return { ok: false, errorKey: mapped };
    }

    if (isDuplicateSignUpUser(data.user)) {
      return { ok: false, errorKey: duplicateEmailErrorKey(parsed.data.intendedRole) };
    }

    return { ok: true, needsEmailConfirmation: !data.session };
  });
}

export async function requestPasswordResetAction(
  input: ForgotPasswordInput,
  redirectTo: string,
): Promise<AuthActionSuccess | AuthActionFailure> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errorKey: "genericError" };
  }

  return withAuthClient(async (supabase) => {
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo,
    });

    if (error) {
      return { ok: false, errorKey: getAuthErrorMessage(error.message) };
    }

    return { ok: true };
  });
}

export async function updatePasswordAction(
  input: UpdatePasswordInput,
): Promise<AuthActionSuccess | AuthActionFailure> {
  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errorKey: "genericError" };
  }

  return withAuthClient(async (supabase) => {
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

    if (error) {
      return { ok: false, errorKey: getAuthErrorMessage(error.message) };
    }

    return { ok: true };
  });
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
