import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { DEFAULT_LOCALE, isLocale, t } from "@/lib/i18n";
import { angles } from "@/content/angles";
import { site } from "@/content/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Gabriel Debarnot — Engineering";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return renderOgImage({
    label: t(angles.engineering.label, active),
    title: t(angles.engineering.positioning, active),
    footer: site.name,
  });
}
