import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/shared/lib/i18n";

function safeNext(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/auth/redirect";
  }
  return path;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale: localeParam } = await context.params;
  const locale = isLocale(localeParam) ? localeParam : "ar";
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL(`/${locale}/login`, origin));
    }
  }

  if (next === "/auth/update-password") {
    return NextResponse.redirect(new URL(`/${locale}/auth/update-password`, origin));
  }

  const url = new URL(`/${locale}/auth/redirect`, origin);
  url.searchParams.set("source", "confirm");
  if (next !== "/auth/redirect") {
    url.searchParams.set("next", next);
  }
  return NextResponse.redirect(url);
}
