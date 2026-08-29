"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, Search, Sparkles } from "lucide-react";
import { CITY_SLUGS, type CitySlug } from "../data/mock";
import { VENDOR_CATEGORY_SLUGS, type VendorCategorySlug } from "../types/category";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";

type HeroSearchProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function HeroSearch({ locale, dictionary }: HeroSearchProps) {
  const router = useRouter();
  const [category, setCategory] = useState<VendorCategorySlug>(VENDOR_CATEGORY_SLUGS[0]);
  const [city, setCity] = useState<CitySlug>(CITY_SLUGS[0]);
  const [date, setDate] = useState("");

  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set("city", city);
    if (date) params.set("date", date);
    router.push(`${localizedPath(locale, `/vendors/${category}`)}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSearch}
      className="grid w-full gap-2 rounded-2xl bg-card p-2 shadow-lift sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]"
    >
      <label className="flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted/60">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            {dictionary.home.searchCategory}
          </span>
            <Select value={category} onValueChange={(value) => setCategory(value as VendorCategorySlug)}>
            <SelectTrigger className="h-8 w-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="min-w-56">
              {VENDOR_CATEGORY_SLUGS.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {dictionary.categories[slug].title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </label>

      <label className="flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted/60">
        <MapPin className="size-4 shrink-0 text-primary" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            {dictionary.home.searchCity}
          </span>
            <Select value={city} onValueChange={(value) => setCity(value as CitySlug)}>
            <SelectTrigger className="h-8 w-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="min-w-48">
              {CITY_SLUGS.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {dictionary.cities[slug]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </label>

      <label className="flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted/60">
        <CalendarDays className="size-4 shrink-0 text-primary" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            {dictionary.home.searchDate}
          </span>
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </span>
      </label>

      <Button type="submit" size="xl" className="min-h-14 w-full lg:min-w-36">
        <Search />
        {dictionary.home.searchCta}
      </Button>
    </form>
  );
}
