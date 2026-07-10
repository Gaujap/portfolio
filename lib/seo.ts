import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";

/** OpenGraph locale codes. */
function ogLocale(locale: Locale): string {
  return locale === "fr" ? "fr_FR" : "en_US";
}

/**
 * hreflang alternates for a route: one entry per locale plus x-default.
 * `path` is the locale-less path, e.g. "" (home), "/ai", "/work/hermes".
 */
function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = `/${locale}${path}`;
  languages["x-default"] = `/en${path}`;
  return languages;
}

/**
 * Build per-route, per-locale metadata: canonical + hreflang alternates and
 * OpenGraph/Twitter. OG images come from the `opengraph-image` files, so they
 * are not set here. Home passes `absoluteTitle` to skip the "· name" template.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = `/${locale}${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
