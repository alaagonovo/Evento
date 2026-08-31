"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getDirection, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { CategoryCard, type CategoryCardItem } from "./category-card";

const AUTOPLAY_MS = 3800;

type CategorySwiperProps = {
  categories: CategoryCardItem[];
  locale: Locale;
  dictionary: Dictionary;
};

function slideDelta(scroller: HTMLElement) {
  const slide = scroller.querySelector<HTMLElement>("[data-slide]");
  const styles = getComputedStyle(scroller);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 16;
  return (slide?.offsetWidth ?? 280) + gap;
}

function isAtEnd(scroller: HTMLElement) {
  const max = scroller.scrollWidth - scroller.clientWidth;
  if (max <= 8) return true;
  const left = scroller.scrollLeft;
  return left >= max - 8 || left <= 8 - max;
}

export function CategorySwiper({ categories, locale, dictionary }: CategorySwiperProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isRtl = getDirection(locale) === "rtl";

  function scroll(next: boolean) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const direction = next ? 1 : -1;
    scroller.scrollBy({
      left: (isRtl ? -direction : direction) * slideDelta(scroller),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const root = rootRef.current;
    const scroller = scrollerRef.current;
    if (!root || !scroller || categories.length < 2) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false;
    let inView = true;

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    const onFocusOut = (event: FocusEvent) => {
      if (!root.contains(event.relatedTarget as Node | null)) resume();
    };

    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", onFocusOut);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.35 },
    );
    observer.observe(root);

    const timer = window.setInterval(() => {
      if (motion.matches || paused || document.hidden || !inView) return;

      if (isAtEnd(scroller)) {
        scroller.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      const direction = 1;
      scroller.scrollBy({
        left: (isRtl ? -direction : direction) * slideDelta(scroller),
        behavior: "smooth",
      });
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      root.removeEventListener("pointerenter", pause);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("focusin", pause);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, [categories.length, isRtl]);

  return (
    <div ref={rootRef} className="relative">
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
