import { CITY_SLUGS, type CitySlug } from "../data/mock";
import type { Dictionary } from "@/shared/lib/i18n";

function isCitySlug(value: string): value is CitySlug {
  return (CITY_SLUGS as readonly string[]).includes(value);
}

export function cityLabel(city: string, dictionary: Dictionary) {
  const slug = city.trim().toLowerCase().replace(/\s+/g, "-");
  if (isCitySlug(slug)) return dictionary.cities[slug];
  return city;
}
