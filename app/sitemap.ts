import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { site } from "@/content/site";
import { PROJECT_SLUGS } from "@/content/projects";

const STATIC_PATHS = ["", "/ai", "/security", "/engineering", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...PROJECT_SLUGS.map((slug) => `/work/${slug}`),
  ];

  return paths.flatMap((path) => {
    // Each URL lists its locale alternates for hreflang.
    const languages = Object.fromEntries(
      LOCALES.map((locale) => [locale, `${site.url}/${locale}${path}`]),
    );
    return LOCALES.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      alternates: { languages },
    }));
  });
}
