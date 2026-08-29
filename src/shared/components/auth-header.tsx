import Link from "next/link";
import { BrandMark } from "@/shared/components/brand-mark";
import { Container } from "@/shared/components/container";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";

type AuthHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function AuthHeader({ locale, dictionary }: AuthHeaderProps) {
  return (
    <header className="shrink-0">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={localizedPath(locale, "/")} className="text-foreground">
          <BrandMark />
        </Link>
        <LanguageSwitcher locale={locale} labels={dictionary.language} />
      </Container>
    </header>
  );
}
