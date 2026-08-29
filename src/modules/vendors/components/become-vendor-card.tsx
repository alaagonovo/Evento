import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";

export function BecomeVendorCard({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.dashboard.becomeVendorTitle}</CardTitle>
        <CardDescription>{dictionary.dashboard.becomeVendorBody}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href={localizedPath(locale, "/vendor/onboarding")}>
            {dictionary.dashboard.becomeVendorCta}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
