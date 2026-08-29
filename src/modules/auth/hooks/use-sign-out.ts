"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOutAction } from "../services/auth-actions";

export function useSignOut(afterHref: string) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      await signOutAction();
      router.replace(afterHref);
      router.refresh();
    });
  }

  return { signOut, pending };
}
