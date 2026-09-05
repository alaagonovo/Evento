export const MIN_NOTICE_DAYS = 3;

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addLocalDays(days: number, from = new Date()) {
  const next = new Date(from);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return toDateKey(next);
}

export function minBookableDate(from = new Date()) {
  return addLocalDays(MIN_NOTICE_DAYS, from);
}

export function isBeforeMinBookableDate(dateKey: string, from = new Date()) {
  return dateKey < minBookableDate(from);
}

export function formatDateKey(dateKey: string, locale: "ar" | "en") {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1));
}
