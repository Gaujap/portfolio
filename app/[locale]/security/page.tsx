import { AnglePage } from "@/components/angle-page";
import type { Locale } from "@/lib/i18n";

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <AnglePage angle="security" locale={locale} />;
}
