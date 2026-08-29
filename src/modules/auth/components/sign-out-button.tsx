"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useSignOut } from "../hooks/use-sign-out";

export function SignOutButton({
  afterHref,
  label,
  className,
}: {
  afterHref: string;
  label: string;
  className?: string;
}) {
  const { signOut, pending } = useSignOut(afterHref);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(className)}
      onClick={signOut}
      disabled={pending}
    >
      {label}
    </Button>
  );
}
