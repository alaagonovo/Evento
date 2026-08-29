import type { UserRole } from "@/lib/supabase/database.types";
import type { VendorStatus } from "@/lib/supabase/database.types";

export function getPostAuthPath(options: {
  role: UserRole;
  vendorStatus: VendorStatus | null;
  source: "login" | "confirm";
  next?: string | null;
}) {
  const next = safeInternalPath(options.next);

  if (options.role === "admin") {
    return "/admin";
  }

  if (options.role === "vendor") {
    if (!options.vendorStatus) {
      return "/vendor/onboarding";
    }
    return "/dashboard/vendor";
  }

  if (options.source === "confirm") {
    return next ?? "/";
  }

  return next ?? "/dashboard";
}

export function safeInternalPath(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return null;
  }
  return path;
}
