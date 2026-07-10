import { AnglePage } from "@/components/angle-page";
import type { Locale } from "@/lib/i18n";

export default async function EngineeringPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <AnglePage angle="engineering" locale={locale} />;
}
