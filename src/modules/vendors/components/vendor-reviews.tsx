import { MessageCircleHeart } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { StarRating } from "@/shared/components/star-rating";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { localized } from "@/shared/lib/utils";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import type { VendorReview } from "../data/mock";

type VendorReviewsProps = {
  reviews: VendorReview[];
  locale: Locale;
  dictionary: Dictionary;
};

export function VendorReviews({ reviews, locale, dictionary }: VendorReviewsProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircleHeart className="size-6" />}
        title={dictionary.vendor.noReviews}
        description={dictionary.vendor.noReviewsHint}
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-2xl bg-card p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>
                {localized(review.author, locale).slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{localized(review.author, locale)}</p>
                <span className="text-xs text-muted-foreground">
                  {localized(review.date, locale)}
                </span>
              </div>
              <StarRating value={review.rating} className="mt-1" />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {localized(review.text, locale)}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
