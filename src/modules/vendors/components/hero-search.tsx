"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Check, ChevronDown, MapPin, Search, Sparkles, X } from "lucide-react";
import { CITY_SLUGS } from "../data/mock";
import { VENDOR_CATEGORY_SLUGS, type VendorCategorySlug } from "../types/category";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/utils";

type HeroSearchProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const ALL_CITIES = "all";
const NEAR_ME = "near-me";
const MIN_NOTICE_DAYS = 3;

function addLocalDays(days: number) {
  const next = new Date();
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + days);
  const year = next.getFullYear();
  const month = String(next.getMonth() + 1).padStart(2, "0");
  const day = String(next.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function FieldDivider() {
  return <div aria-hidden className="hidden h-8 w-px shrink-0 bg-border/70 lg:block" />;
}

export function HeroSearch({ locale, dictionary }: HeroSearchProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<VendorCategorySlug[]>([]);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [city, setCity] = useState<string>(ALL_CITIES);
  const minDate = addLocalDays(MIN_NOTICE_DAYS);
  const [date, setDate] = useState(minDate);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const filteredCategories = VENDOR_CATEGORY_SLUGS.filter((slug) =>
    dictionary.categories[slug].title.toLowerCase().includes(categoryQuery.trim().toLowerCase()),
  );

  function toggleCategory(slug: VendorCategorySlug) {
    setCategories((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  function categoryLabel() {
    if (categories.length === 0) return dictionary.home.searchCategoriesPlaceholder;
    if (categories.length === 1) return dictionary.categories[categories[0]].title;
    return `${categories.length} ${dictionary.home.searchSelected}`;
  }

  async function readCurrentPosition() {
    if (!navigator.geolocation) {
      throw new Error("unsupported");
    }

    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60_000,
      });
    });
  }

  async function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const slug of categories) {
      params.append("category", slug);
    }
    if (date) params.set("date", date);

    if (city === NEAR_ME) {
      setLocationError("");
      setLocating(true);
      try {
        const position = await readCurrentPosition();
        params.set("lat", position.coords.latitude.toFixed(6));
        params.set("lng", position.coords.longitude.toFixed(6));
      } catch {
        setLocationError(dictionary.home.searchLocationDenied);
        setLocating(false);
        return;
      }
      setLocating(false);
    } else if (city && city !== ALL_CITIES) {
      params.set("city", city);
    }

    const query = params.toString();
    router.push(`${localizedPath(locale, "/vendors")}${query ? `?${query}` : ""}`);
  }

  return (
    <form onSubmit={onSearch} className="w-full">
      <div className="flex flex-col gap-1 rounded-[2rem] bg-card p-1.5 shadow-lift ring-1 ring-black/6 lg:flex-row lg:items-center lg:rounded-full">
        <div className="flex min-h-14 flex-1 items-center gap-3 rounded-full px-5 transition-colors hover:bg-muted/60">
          <Sparkles className="size-4 shrink-0 text-gold" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
              {dictionary.home.searchCategory}
            </span>
            <DropdownMenu
              onOpenChange={(open) => {
                if (!open) setCategoryQuery("");
              }}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-between gap-2 bg-transparent text-start text-sm outline-none"
                >
                  <span className={cn("truncate", categories.length === 0 && "text-muted-foreground")}>
                    {categoryLabel()}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="flex w-72 flex-col overflow-hidden p-0"
                style={{ maxHeight: "20rem" }}
              >
                <div className="shrink-0 border-b border-border p-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={categoryQuery}
                      onChange={(event) => setCategoryQuery(event.target.value)}
                      onKeyDown={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                      placeholder={dictionary.home.searchCategoriesFilter}
                      className="h-9 ps-8"
                    />
                  </div>
                  <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
                    {dictionary.home.searchCategoriesHint}
                  </p>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-1">
                  {filteredCategories.length === 0 ? (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                      {dictionary.home.searchCategoriesEmpty}
                    </p>
                  ) : (
                    filteredCategories.map((slug) => (
                      <DropdownMenuCheckboxItem
                        key={slug}
                        checked={categories.includes(slug)}
                        onCheckedChange={() => toggleCategory(slug)}
                        onSelect={(event) => event.preventDefault()}
                      >
                        {dictionary.categories[slug].title}
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
                </div>
                {categories.length > 0 ? (
                  <div className="shrink-0 border-t border-border p-1">
                    <DropdownMenuItem onSelect={() => setCategories([])}>
                      {dictionary.home.searchClearCategories}
                    </DropdownMenuItem>
                  </div>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <FieldDivider />

        <label className="flex min-h-14 flex-1 items-center gap-3 rounded-full px-5 transition-colors hover:bg-muted/60">
          <MapPin className="size-4 shrink-0 text-gold" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
              {dictionary.home.searchCity}
            </span>
            <Select
              value={city}
              onValueChange={(value) => {
                setCity(value);
                setLocationError("");
              }}
            >
              <SelectTrigger className="h-7 w-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" position="popper" className="min-w-48">
                <SelectItem value={ALL_CITIES}>{dictionary.home.searchAnyCity}</SelectItem>
                <SelectItem value={NEAR_ME}>{dictionary.home.searchCurrentLocation}</SelectItem>
                {CITY_SLUGS.map((slug) => (
                  <SelectItem key={slug} value={slug}>
                    {dictionary.cities[slug]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        </label>

        <FieldDivider />

        <label className="flex min-h-16 flex-[1.25] items-center gap-3 rounded-full px-5 transition-colors hover:bg-muted/60">
          <CalendarDays className="size-5 shrink-0 text-gold" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
              {dictionary.home.searchDate}
            </span>
            <Input
              type="date"
              min={minDate}
              value={date}
              onChange={(event) => {
                const next = event.target.value;
                setDate(next && next < minDate ? minDate : next);
              }}
              className="h-10 min-w-[11rem] border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:scale-125"
            />
          </span>
        </label>

        <Button
          type="submit"
          variant="gold"
          size="xl"
          disabled={locating}
          className="h-12 w-full rounded-2xl shadow-soft lg:size-12 lg:w-12 lg:min-w-12 lg:shrink-0 lg:self-center lg:rounded-full lg:px-0"
          aria-label={locating ? dictionary.home.searchLocating : dictionary.home.searchCta}
        >
          <Search className="size-5" />
          <span className="lg:hidden">{dictionary.home.searchCta}</span>
        </Button>
      </div>
      {locationError ? (
        <p className="mt-2 px-3 text-sm text-destructive">{locationError}</p>
      ) : locating ? (
        <p className="mt-2 px-3 text-sm text-muted-foreground">{dictionary.home.searchLocating}</p>
      ) : null}

      {categories.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 px-2">
          {categories.map((slug) => (
            <Badge key={slug} variant="secondary" className="h-7 gap-1 pe-1">
              {dictionary.categories[slug].title}
              <button
                type="button"
                onClick={() => toggleCategory(slug)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`${dictionary.home.searchRemoveCategory} ${dictionary.categories[slug].title}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Check className="size-3 text-gold" />
            {categories.length} {dictionary.home.searchSelected}
          </span>
        </div>
      ) : null}
    </form>
  );
}
