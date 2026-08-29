import { redirect } from "next/navigation";
import { defaultLocale } from "@/shared/lib/i18n";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
