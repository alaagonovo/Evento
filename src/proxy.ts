import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  getAuthGateRedirect,
  isAuthPagePath,
  isProtectedPath,
} from "./modules/auth/services/route-guard";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  locales,
  localizedPath,
  stripLocalePrefix,
  type Locale,
} from "@/shared/lib/i18n";

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";

  if (acceptLanguage.includes("ar")) {
    return "ar";
  }

  if (acceptLanguage.includes("en")) {
    return "en";
  }

  return defaultLocale;
}

function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  return to;
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return supabaseResponse;
  }

  if (!pathnameHasLocale(pathname)) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

    const redirect = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirect);
    redirect.cookies.set(localeCookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return redirect;
  }

  const { locale, path } = stripLocalePrefix(pathname);
  const normalizedPath = path.replace(/\/$/, "") || "/";
  const activeLocale = locale ?? defaultLocale;

  const needsProfile =
    Boolean(user) && (isAuthPagePath(normalizedPath) || isProtectedPath(normalizedPath));

  let role: "customer" | "vendor" | "admin" | null = null;
  let vendorStatus: "pending" | "approved" | "rejected" | "suspended" | null = null;

  if (needsProfile && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    role = profile?.role ?? null;

    if (role === "vendor") {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("status")
        .eq("profile_id", user.id)
        .maybeSingle();

      vendorStatus = vendor?.status ?? null;
    }
  }

  const dest = getAuthGateRedirect({
    pathname: normalizedPath,
    isAuthenticated: Boolean(user),
    role,
    vendorStatus,
    next: request.nextUrl.searchParams.get("next"),
  });

  if (dest) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(activeLocale, dest.pathname);
    url.search = dest.search ?? "";
    return copyCookies(supabaseResponse, NextResponse.redirect(url));
  }

  return supabaseResponse;
}

export const proxyConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
