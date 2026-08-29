"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { Dictionary } from "@/shared/lib/i18n";
import { useUpdatePassword } from "../hooks/use-update-password";

type UpdatePasswordFormProps = {
  afterHref: string;
  dictionary: Dictionary;
};

export function UpdatePasswordForm({ afterHref, dictionary }: UpdatePasswordFormProps) {
  const { form, onSubmit, pending, error } = useUpdatePassword(afterHref, dictionary.auth);
  const copy = dictionary.auth;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="password">{copy.password}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="xl" className="w-full" disabled={pending}>
        {copy.updatePasswordSubmit}
      </Button>
    </form>
  );
}
