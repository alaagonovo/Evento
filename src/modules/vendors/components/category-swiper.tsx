"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getDirection, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { CategoryCard, type CategoryCardItem } from "./category-card";

type CategorySwiperProps = {
  categories: CategoryCardItem[];
  locale: Locale;
  dictionary: Dictionary;
};

export function CategorySwiper({ categories, locale, dictionary }: CategorySwiperProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isRtl = getDirection(locale) === "rtl";

  function scroll(next: boolean) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const slide = scroller.querySelector<HTMLElement>("[data-slide]");
    const styles = getComputedStyle(scroller);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 16;
    const delta = (slide?.offsetWidth ?? 280) + gap;
    const direction = next ? 1 : -1;
    scroller.scrollBy({
      left: (isRtl ? -direction : direction) * delta,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <div
            key={category.slug}
            data-slide
            className="w-[min(18.5rem,78vw)] shrink-0 snap-start sm:w-72 lg:w-80"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll(false)}
          aria-label={dictionary.home.prevCategories}
        >
          {isRtl ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll(true)}
          aria-label={dictionary.home.nextCategories}
        >
          {isRtl ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
    </div>
  );
}
