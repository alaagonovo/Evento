"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { useForgotPassword } from "../hooks/use-forgot-password";

type ForgotPasswordFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function ForgotPasswordForm({ locale, dictionary }: ForgotPasswordFormProps) {
  const { form, onSubmit, pending, sent, error } = useForgotPassword(locale, dictionary.auth);
  const copy = dictionary.auth;

  if (sent) {
    return <p className="text-sm text-muted-foreground">{copy.resetSent}</p>;
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">{copy.email}</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="xl" className="w-full" disabled={pending}>
        {copy.sendReset}
      </Button>
      <p className="text-center text-sm">
        <Link href={localizedPath(locale, "/login")} className="text-muted-foreground hover:text-foreground">
          {copy.backToSignIn}
        </Link>
      </p>
    </form>
  );
}
