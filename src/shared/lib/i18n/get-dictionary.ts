import { ar } from "./ar";
import { en, type Dictionary } from "./en";
import { defaultLocale, isLocale, type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function parseLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
