import { isLocale, type Locale } from "./config";

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

export function stripLocalePrefix(pathname: string): { locale: Locale | null; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];

  if (maybeLocale && isLocale(maybeLocale)) {
    const rest = segments.slice(1).join("/");
    const path = rest ? `/${rest}` : "/";
    return { locale: maybeLocale, path };
  }

  return { locale: null, path: pathname || "/" };
}

export function replaceLocaleInPathname(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/");
  segments[1] = nextLocale;
  return segments.join("/") || `/${nextLocale}`;
}
