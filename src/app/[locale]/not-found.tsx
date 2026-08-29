import { cookies } from "next/headers";
import { getDictionary, localeCookieName, parseLocale } from "@/shared/lib/i18n";

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(localeCookieName)?.value ?? "ar");
  const dictionary = getDictionary(locale);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-muted-foreground">{dictionary.common.comingSoon}</p>
    </div>
  );
}
