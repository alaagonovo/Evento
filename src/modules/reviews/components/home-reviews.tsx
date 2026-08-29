import { Container } from "@/shared/components/container";
import { type Dictionary, type Locale } from "@/shared/lib/i18n";
import { ReviewMarquee } from "./review-marquee";

type HomeReviewsProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function HomeReviews({ locale, dictionary }: HomeReviewsProps) {
  return (
    <section id="reviews" className="scroll-mt-24 overflow-hidden py-16 sm:py-20">
      <Container className="mb-8">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl">{dictionary.home.reviewsHeading}</h2>
          <p className="mt-3 text-muted-foreground">{dictionary.home.reviewsSubtitle}</p>
        </div>
      </Container>
      <ReviewMarquee locale={locale} dictionary={dictionary} />
    </section>
  );
}
