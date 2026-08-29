"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { SignOutButton } from "@/modules/auth";
import { BrandMark } from "@/shared/components/brand-mark";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { UserAvatar } from "@/shared/components/user-avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";

type NavLink = { href: string; label: string };

type MobileNavProps = {
  locale: Locale;
  dictionary: Dictionary;
  links: NavLink[];
  accountLinks?: NavLink[];
  isAuthenticated?: boolean;
  fullName?: string;
  avatarUrl?: string | null;
};

export function MobileNav({
  locale,
  dictionary,
  links,
  accountLinks = [],
  isAuthenticated = false,
  fullName,
  avatarUrl,
}: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={dictionary.nav.menu}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={locale === "ar" ? "right" : "left"} className="w-[min(100%,20rem)]">
        <SheetHeader>
          <SheetTitle>
            <BrandMark />
          </SheetTitle>
        </SheetHeader>
        {isAuthenticated && fullName ? (
          <div className="flex items-center gap-3 px-4 pb-2">
            <UserAvatar name={fullName} src={avatarUrl} />
            <p className="min-w-0 truncate text-sm font-medium">{fullName}</p>
          </div>
        ) : null}
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          {accountLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 p-4">
          <LanguageSwitcher locale={locale} labels={dictionary.language} />
          {isAuthenticated ? (
            <SignOutButton
              afterHref={localizedPath(locale, "/")}
              label={dictionary.auth.signOut}
            />
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href={localizedPath(locale, "/login")}>{dictionary.nav.login}</Link>
              </Button>
              <Button asChild>
                <Link href={`${localizedPath(locale, "/signup")}?role=vendor`}>
                  {dictionary.nav.becomeVendor}
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
