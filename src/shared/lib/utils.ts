import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Locale } from "@/shared/lib/i18n/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, locale: Locale) {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    maximumFractionDigits: 0,
  }).format(amount)

  return locale === "ar" ? `${formatted} ج.م` : `EGP ${formatted}`
}

export function localized<T extends { ar: string; en: string }>(
  value: T,
  locale: Locale,
) {
  return value[locale]
}
