import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariables } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/locale-context";
import { LOCALES, DEFAULT_LOCALE, isLocale, t } from "@/lib/i18n";
import { SkipLink } from "@/components/chrome/skip-link";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { ThemeManager } from "@/components/chrome/theme-manager";
import { ui } from "@/content/ui";
import { seo } from "@/content/seo";
import { site } from "@/content/site";

// The locale set is closed: only /en and /fr are prerendered, anything else 404s.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return {
    title: { default: t(seo.home.title, active), template: `%s · ${site.name}` },
    description: t(seo.home.description, active),
    openGraph: {
      siteName: site.name,
      locale: active === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
  };
}

// Runs before first paint: marks JS as available (so scroll-reveal can hide its
// initial state) and applies the persisted theme — avoiding any flash.
// The site is dark by default: only a stored "light" preference opts out.
const bootScript = `(function(){var e=document.documentElement;e.classList.add('js');try{if(localStorage.getItem('theme')!=='light')e.classList.add('dark');}catch(_){e.classList.add('dark');}})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: t(site.role, locale),
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lyon",
      addressCountry: "FR",
    },
    sameAs: site.socials.map((social) => social.href),
    alumniOf: { "@type": "CollegeOrUniversity", name: "Epitech" },
  };

  return (
    // Font classes go on <body>, not <html>: the boot script + theme toggle
    // mutate <html>'s class imperatively, so React must not also own it (it
    // would reset .dark on locale navigation). ThemeManager re-applies the
    // theme on every route change as a second guard.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className={fontVariables}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <LocaleProvider locale={locale}>
          <ThemeManager />
          <SkipLink label={t(ui.actions.skipToContent, locale)} />
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
