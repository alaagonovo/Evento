import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Container } from "@/shared/components/container";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";
import { MOCK_OFFERS } from "../data/mock";
import { OfferCard } from "./offer-card";

type HomeOffersProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const HOME_OFFERS_LIMIT = 4;

export function HomeOffers({ locale, dictionary }: HomeOffersProps) {
  const offers = MOCK_OFFERS.slice(0, HOME_OFFERS_LIMIT);

  return (
    <section id="offers" className="scroll-mt-24 pb-16 sm:pb-20">
      <Container className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-4xl">{dictionary.home.offersHeading}</h2>
            <p className="mt-3 text-muted-foreground">{dictionary.home.offersSubtitle}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={localizedPath(locale, "/offers")}>{dictionary.home.viewAll}</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} locale={locale} dictionary={dictionary} />
          ))}
        </div>
      </Container>
    </section>
  );
}
