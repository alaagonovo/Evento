"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { useSignUp } from "../hooks/use-sign-up";
import type { IntendedRole } from "../types/auth";

type SignUpFormProps = {
  locale: Locale;
  dictionary: Dictionary;
  defaultRole?: IntendedRole;
};

export function SignUpForm({ locale, dictionary, defaultRole = "customer" }: SignUpFormProps) {
  const { form, onSubmit, onEmailBlur, pending, checkEmail, error, errorKey } = useSignUp(
    locale,
    localizedPath(locale, "/auth/redirect"),
    dictionary.auth,
    defaultRole,
  );
  const copy = dictionary.auth;
  const role = form.watch("intendedRole");
  const loginHref = localizedPath(locale, "/login");
  const resetHref = localizedPath(locale, "/forgot-password");

  if (checkEmail) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="font-heading text-2xl">{copy.checkEmailTitle}</h2>
        <p className="text-sm text-muted-foreground">{copy.checkEmailBody}</p>
        <Button asChild variant="outline">
          <Link href={loginHref}>{copy.backToSignIn}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        {(["customer", "vendor"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition",
              role === value ? "bg-card shadow-soft" : "text-muted-foreground",
            )}
            onClick={() => form.setValue("intendedRole", value)}
          >
            {value === "customer" ? copy.customer : copy.vendor}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">{copy.fullName}</Label>
        <Input id="fullName" autoComplete="name" {...form.register("fullName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{copy.email}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...form.register("email", { onBlur: onEmailBlur })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{copy.password}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
        />
      </div>
      {errorKey === "emailTaken" || errorKey === "emailTakenVendor" ? (
        role === "vendor" ? (
          <p className="text-sm text-destructive">
            {copy.emailTakenVendorLead}{" "}
            <Link href={loginHref} className="font-medium underline underline-offset-4">
              {copy.logIn}
            </Link>
            {copy.emailTakenVendorRest}
          </p>
        ) : (
          <p className="text-sm text-destructive">
            {copy.emailTaken}{" "}
            <Link href={loginHref} className="font-medium underline underline-offset-4">
              {copy.logIn}
            </Link>{" "}
            {copy.emailTakenOr}{" "}
            <Link href={resetHref} className="font-medium underline underline-offset-4">
              {copy.resetYourPassword}
            </Link>{" "}
            {copy.emailTakenForgot}
          </p>
        )
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
      <Button type="submit" size="xl" className="w-full" disabled={pending}>
        {copy.submitSignUp}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {copy.hasAccount}{" "}
        <Link href={loginHref} className="text-foreground underline-offset-4 hover:underline">
          {copy.signInLink}
        </Link>
      </p>
    </form>
  );
}
