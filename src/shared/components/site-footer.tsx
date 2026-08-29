import Link from "next/link";
import { BrandMark } from "@/shared/components/brand-mark";
import { Container } from "@/shared/components/container";
import { CITY_SLUGS, VENDOR_CATEGORY_SLUGS } from "@/modules/vendors";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-secondary text-secondary-foreground">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs space-y-4">
          <BrandMark className="text-secondary-foreground [&_.bg-gold]:bg-gold" />
          <p className="text-sm leading-relaxed text-secondary-foreground/70">
            {dictionary.footer.tagline}
          </p>
        </div>

        <div>
          <h2 className="font-heading text-lg text-gold">{dictionary.footer.categories}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {VENDOR_CATEGORY_SLUGS.map((slug) => (
              <li key={slug}>
                <Link
                  href={localizedPath(locale, `/vendors/${slug}`)}
                  className="text-secondary-foreground/75 transition-colors hover:text-secondary-foreground"
                >
                  {dictionary.categories[slug].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-lg text-gold">{dictionary.footer.cities}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CITY_SLUGS.map((slug) => (
              <li key={slug}>
                <Link
                  href={localizedPath(locale, `/vendors?city=${slug}`)}
                  className="text-secondary-foreground/75 transition-colors hover:text-secondary-foreground"
                >
                  {dictionary.cities[slug]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-lg text-gold">{dictionary.footer.company}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href={localizedPath(locale, "/")} className="text-secondary-foreground/75 hover:text-secondary-foreground">
                {dictionary.footer.about}
              </Link>
            </li>
            <li>
              <Link href={localizedPath(locale, "/login")} className="text-secondary-foreground/75 hover:text-secondary-foreground">
                {dictionary.footer.help}
              </Link>
            </li>
            <li>
              <Link href={`${localizedPath(locale, "/signup")}?role=vendor`} className="text-secondary-foreground/75 hover:text-secondary-foreground">
                {dictionary.footer.becomeVendor}
              </Link>
            </li>
            <li>
              <Link href={localizedPath(locale, "/admin")} className="text-secondary-foreground/75 hover:text-secondary-foreground">
                {dictionary.nav.admin}
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-secondary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dictionary.footer.copyright}
          </p>
          <div className="flex gap-4">
            <Link href={localizedPath(locale, "/")}>{dictionary.footer.privacy}</Link>
            <Link href={localizedPath(locale, "/")}>{dictionary.footer.terms}</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
