import { AdminVendorTable, listVendorsForAdmin } from "@/modules/vendors";
import { getDictionary, parseLocale } from "@/shared/lib/i18n";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminVendorsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const dictionary = getDictionary(locale);
  const vendors = await listVendorsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">{dictionary.admin.vendors}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{dictionary.admin.intro}</p>
      </div>
      <AdminVendorTable vendors={vendors} dictionary={dictionary} locale={locale} />
    </div>
  );
}
