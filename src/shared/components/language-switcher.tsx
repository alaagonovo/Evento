"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
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
    writeLocaleCookie(nextLocale);
    router.push(replaceLocaleInPathname(pathname, nextLocale));
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={labels.switchTo}>
      {locales.map((item) => (
        <Button
          key={item}
          type="button"
          size="sm"
          variant={item === locale ? "default" : "ghost"}
          onClick={() => setLocale(item)}
        >
          {labels[item]}
        </Button>
      ))}
    </div>
  );
}
