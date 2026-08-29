"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { useSignIn } from "../hooks/use-sign-in";

type SignInFormProps = {
  locale: Locale;
  dictionary: Dictionary;
  nextPath?: string;
};

export function SignInForm({ locale, dictionary, nextPath }: SignInFormProps) {
  const continueHref = nextPath
    ? `${localizedPath(locale, "/auth/redirect")}?next=${encodeURIComponent(nextPath)}`
    : localizedPath(locale, "/auth/redirect");
  const { form, onSubmit, pending, error } = useSignIn(continueHref, dictionary.auth);
  const copy = dictionary.auth;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">{copy.email}</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password">{copy.password}</Label>
          <Link
            href={localizedPath(locale, "/forgot-password")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {copy.forgotPassword}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...form.register("password")}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="xl" className="w-full" disabled={pending}>
        {copy.submitSignIn}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {copy.noAccount}{" "}
        <Link href={localizedPath(locale, "/signup")} className="text-foreground underline-offset-4 hover:underline">
          {copy.signUpLink}
        </Link>
      </p>
    </form>
  );
}
