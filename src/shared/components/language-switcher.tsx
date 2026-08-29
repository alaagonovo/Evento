"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
  localeCookieName,
  locales,
  replaceLocaleInPathname,
  type Locale,
} from "@/shared/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
  labels: {
    ar: string;
    en: string;
    switchTo: string;
  };
};

function writeLocaleCookie(nextLocale: Locale) {
  const cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000`;
  window.document.cookie = cookie;
}

export function LanguageSwitcher({ locale, labels }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function setLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    writeLocaleCookie(nextLocale);
    router.push(replaceLocaleInPathname(pathname, nextLocale));
  }

  function toggle() {
    setLocale(locale === "ar" ? "en" : "ar");
  }

  return (
    <div
      dir="ltr"
      role="group"
      aria-label={labels.switchTo}
      className="inline-flex h-9 w-fit self-start items-center rounded-full border border-border bg-muted p-0.5"
    >
      {locales.map((item) => {
        const active = item === locale;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            aria-label={labels[item]}
            onClick={() => (active ? toggle() : setLocale(item))}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item === "en" ? "EN" : "AR"}
          </button>
        );
      })}
    </div>
  );
}
