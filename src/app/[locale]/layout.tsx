import type { Metadata, Viewport } from "next";
import { Amiri, Cairo, Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { InstallPrompt } from "@/shared/components/install-prompt";
import {
  getDictionary,
  getDirection,
  isLocale,
  locales,
  type Locale,
} from "@/shared/lib/i18n";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    applicationName: dictionary.brand,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      title: dictionary.brand,
      statusBarStyle: "default",
    },
    icons: {
      icon: "/icons/medigets-512.png",
      apple: "/icons/medigets-180.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#F6F1EA",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const dictionary = getDictionary(locale);
  const direction = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${cairo.variable} ${inter.variable} ${amiri.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        {children}
        <InstallPrompt
          installLabel={dictionary.pwa.install}
          dismissLabel={dictionary.pwa.dismiss}
        />
      </body>
    </html>
  );
}
