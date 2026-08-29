"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { formatPrice } from "@/shared/lib/utils";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";

type BookNowBarProps = {
  vendorId: string;
  price: number;
  locale: Locale;
  dictionary: Dictionary;
};

export function BookNowBar({ vendorId, price, locale, dictionary }: BookNowBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 p-3 shadow-lift backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{dictionary.vendor.startingFrom}</p>
          <p className="truncate font-medium">{formatPrice(price, locale)}</p>
        </div>
        <Button asChild size="xl" className="min-w-36">
          <Link href={localizedPath(locale, `/booking/${vendorId}`)}>
            {dictionary.vendor.bookNow}
          </Link>
        </Button>
      </div>
    </div>
  );
}
