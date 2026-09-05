import type { UserRole, VendorStatus } from "@/lib/supabase/database.types";
import { getPostAuthPath } from "./redirect";

function matches(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function isProtectedPath(path: string) {
  return ["/dashboard", "/admin", "/vendor", "/booking"].some((prefix) => matches(path, prefix));
}

export function isAuthPagePath(path: string) {
  return path === "/login" || path === "/signup" || path === "/forgot-password";
}

export function getAuthGateRedirect(options: {
  pathname: string;
  isAuthenticated: boolean;
  role: UserRole | null;
  vendorStatus: VendorStatus | null;
  next?: string | null;
}): { pathname: string; search?: string } | null {
  const path = options.pathname || "/";

  if (!options.isAuthenticated) {
    if (isProtectedPath(path)) {
      return {
        pathname: "/login",
        search: `?next=${encodeURIComponent(path)}`,
      };
    }
    return null;
  }

  const role = options.role ?? "customer";

  if (isAuthPagePath(path)) {
    return {
      pathname: getPostAuthPath({
        role,
        vendorStatus: options.vendorStatus,
        source: "login",
        next: options.next,
      }),
    };
  }

  if (role === "customer") {
    if (matches(path, "/admin") || matches(path, "/dashboard/vendor")) {
      return { pathname: "/dashboard" };
    }
    if (matches(path, "/vendor") && path !== "/vendor/onboarding") {
      return { pathname: "/dashboard" };
    }
  }

  if (role === "vendor") {
    if (matches(path, "/admin") || path === "/dashboard") {
      return {
        pathname: getPostAuthPath({
          role,
          vendorStatus: options.vendorStatus,
          source: "login",
        }),
      };
    }
  }

  if (role === "admin" && matches(path, "/vendor")) {
    return { pathname: "/admin" };
  }

  return null;
}
