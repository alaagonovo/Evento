import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Container } from "@/shared/components/container";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { CATEGORY_IMAGES, HERO_VIDEO, HERO_VIDEO_POSTER } from "../data/mock";
import { VENDOR_CATEGORY_SLUGS } from "../types/category";
import { CategorySwiper } from "./category-swiper";
import { FeaturedVendors } from "./featured-vendors";
import { HeroBackground } from "./hero-background";
import { HeroSearch } from "./hero-search";
import { HomeOffers } from "./home-offers";
import { SocialProofSection } from "./social-proof-section";

type HomeLandingProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function HomeLanding({ locale, dictionary }: HomeLandingProps) {
  const stats = [
    {
      value: dictionary.home.socialCouplesValue,
      label: dictionary.home.socialCouplesLabel,
    },
    {
      value: dictionary.home.socialRatingValue,
      label: dictionary.home.socialRatingLabel,
    },
    {
      value: dictionary.home.socialVendorsValue,
      label: dictionary.home.socialVendorsLabel,
    },
    {
      value: dictionary.home.socialCitiesValue,
      label: dictionary.home.socialCitiesLabel,
    },
  ];

  return (
    <div>
      <section className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[40rem]">
        <Image
          src={HERO_VIDEO_POSTER}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <HeroBackground src={HERO_VIDEO} />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/55 to-secondary/25" />
        <Container className="relative flex min-h-[34rem] flex-col justify-end gap-8 pb-10 pt-24 sm:min-h-[40rem] sm:pb-14">
          <div className="max-w-2xl text-secondary-foreground">
            <p className="mb-3 text-sm font-medium tracking-wide text-gold">
              {dictionary.home.heroEyebrow}
            </p>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {dictionary.home.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary-foreground/85 sm:text-lg">
              {dictionary.home.heroSubtitle}
            </p>
          </div>
          <HeroSearch locale={locale} dictionary={dictionary} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="space-y-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-4xl">
              {dictionary.home.categoriesHeading}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {dictionary.home.categoriesSubtitle}
            </p>
          </div>
          <CategorySwiper
            locale={locale}
            dictionary={dictionary}
            categories={VENDOR_CATEGORY_SLUGS.map((slug) => ({
              slug,
              title: dictionary.categories[slug].title,
              description: dictionary.categories[slug].description,
              href: localizedPath(locale, `/vendors/${slug}`),
            }))}
          />
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href={localizedPath(locale, "/categories")}>{dictionary.home.viewAll}</Link>
            </Button>
          </div>
        </Container>
      </section>

      <HomeOffers locale={locale} dictionary={dictionary} />

      <section className="pb-16 sm:pb-20">
        <Container className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl sm:text-4xl">
                {dictionary.home.featuredHeading}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {dictionary.home.featuredSubtitle}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={localizedPath(locale, "/vendors")}>{dictionary.home.seeAll}</Link>
            </Button>
          </div>
          <FeaturedVendors locale={locale} dictionary={dictionary} />
        </Container>
      </section>

      <SocialProofSection
        imageSrc={CATEGORY_IMAGES.venues}
        eyebrow={dictionary.home.socialEyebrow}
        heading={dictionary.home.socialHeading}
        subtitle={dictionary.home.socialSubtitle}
        stats={stats}
      />
    </div>
  );
}
