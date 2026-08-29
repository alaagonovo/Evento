"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { checkEmailExists } from "../services/email-exists";

export function useCheckEmailExists() {
  const [checking, setChecking] = useState(false);

  async function check(email: string) {
    setChecking(true);
    try {
      const supabase = createClient();
      return await checkEmailExists(supabase, email);
    } finally {
      setChecking(false);
    }
  }

  return { check, checking };
}
