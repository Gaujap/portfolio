import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { DEFAULT_LOCALE, isLocale, t } from "@/lib/i18n";
import { site } from "@/content/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Gabriel Debarnot — AI systems engineer";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return renderOgImage({
    label: t(site.role, active),
    title: t(site.thesis, active),
    footer: `${site.name} · ${t(site.location, active)}`,
  });
}
