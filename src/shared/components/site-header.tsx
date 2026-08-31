import Link from "next/link";
import { SignOutButton } from "@/modules/auth";
import { getAuthUser } from "@/lib/supabase/server";
import { getProfileById } from "@/modules/users";
import { BrandMark } from "@/shared/components/brand-mark";
import { Container } from "@/shared/components/container";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { MobileNav } from "@/shared/components/mobile-nav";
import { UserMenu } from "@/shared/components/user-menu";
import { Button } from "@/shared/components/ui/button";
import { localizedPath, type Dictionary, type Locale } from "@/shared/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

function homePathForRole(locale: Locale, role: string | undefined) {
  if (role === "vendor") return localizedPath(locale, "/dashboard/vendor");
  if (role === "admin") return localizedPath(locale, "/admin");
  return localizedPath(locale, "/dashboard");
}

export async function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const user = await getAuthUser();
  const profile = user ? await getProfileById(user.id) : null;
  const displayName = user
    ? profile?.fullName || profile?.email.split("@")[0] || user.email?.split("@")[0] || ""
    : "";

  const links = [
    { href: localizedPath(locale, "/"), label: dictionary.nav.home },
    { href: localizedPath(locale, "/vendors"), label: dictionary.nav.vendors },
    { href: localizedPath(locale, "/categories"), label: dictionary.nav.categories },
    { href: localizedPath(locale, "/offers"), label: dictionary.nav.offers },
    { href: `${localizedPath(locale, "/")}#reviews`, label: dictionary.nav.reviews },
  ];

  const accountLinks = user
    ? [
        { href: homePathForRole(locale, profile?.role), label: dictionary.nav.dashboard },
        {
          href: localizedPath(locale, "/dashboard/bookings"),
          label: dictionary.nav.bookings,
        },
        {
          href: localizedPath(locale, "/dashboard/profile"),
          label: dictionary.nav.profile,
        },
      ]
    : [];

  const signOut = (
    <SignOutButton
      afterHref={localizedPath(locale, "/")}
      label={dictionary.auth.signOut}
      className="h-8 w-full justify-start px-2.5 font-normal"
    />
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MobileNav
            locale={locale}
            dictionary={dictionary}
            links={links}
            accountLinks={accountLinks}
            isAuthenticated={Boolean(user)}
            fullName={displayName}
            avatarUrl={profile?.avatarUrl}
          />
          <Link href={localizedPath(locale, "/")} className="text-foreground">
            <BrandMark />
          </Link>
        </div>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher locale={locale} labels={dictionary.language} />
          </div>
          {user ? (
            <UserMenu
              fullName={displayName}
              avatarUrl={profile?.avatarUrl}
              menuLabel={dictionary.nav.accountMenu}
              links={accountLinks}
            >
              {signOut}
            </UserMenu>
          ) : (
            <>
              <Button asChild size="sm">
                <Link href={localizedPath(locale, "/login")}>{dictionary.nav.login}</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link href={`${localizedPath(locale, "/signup")}?role=vendor`}>
                  {dictionary.nav.becomeVendor}
                </Link>
              </Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
