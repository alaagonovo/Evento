import Link from "next/link";
import { StarRating } from "@/shared/components/star-rating";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { localized } from "@/shared/lib/utils";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import type { HighlightReview } from "../types/highlight";

type ReviewCardProps = {
  review: HighlightReview;
  locale: Locale;
  dictionary: Dictionary;
};

export function ReviewCard({ review, locale, dictionary }: ReviewCardProps) {
  const author = localized(review.author, locale);
  const categoryHref = localizedPath(locale, `/vendors/${review.category}`);
  const categoryTitle = dictionary.categories[review.category].title;

  return (
    <article className="flex h-full flex-col rounded-2xl bg-card p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback>{author.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{author}</p>
            <span className="text-xs text-muted-foreground">{localized(review.date, locale)}</span>
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {localized(review.vendorName, locale)}
          </p>
          <StarRating value={review.rating} className="mt-1" />
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {localized(review.text, locale)}
      </p>

      <div className="mt-4">
        <Badge variant="outline" asChild>
          <Link href={categoryHref}>
            {dictionary.home.reviewCategory}: {categoryTitle}
          </Link>
        </Badge>
      </div>
    </article>
  );
}
