"use client";

import { cn } from "@/shared/lib/utils";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import { HIGHLIGHT_REVIEWS } from "../data/highlights";
import { ReviewCard } from "./review-card";

type ReviewMarqueeProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function ReviewMarquee({ locale, dictionary }: ReviewMarqueeProps) {
  const copies = [0, 1] as const;

  return (
    <div className="mask-fade-x group overflow-hidden" aria-label={dictionary.home.reviewsHeading}>
      <div className="flex w-max animate-review-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden">
        {copies.flatMap((copy) =>
          HIGHLIGHT_REVIEWS.map((review) => (
            <div
              key={`${copy}-${review.id}`}
              aria-hidden={copy === 1}
              className={cn(
                "w-[min(20.5rem,82vw)] shrink-0 pe-4 sm:w-80",
                copy === 1 && "motion-reduce:hidden",
              )}
            >
              <ReviewCard review={review} locale={locale} dictionary={dictionary} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
