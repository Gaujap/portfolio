import { AnglePage } from "@/components/angle-page";
import type { Locale } from "@/lib/i18n";

export default async function AiPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <AnglePage angle="ai" locale={locale} />;
}
