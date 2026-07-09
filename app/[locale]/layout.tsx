import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { fontVariables } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/locale-context";
import { LOCALES, isLocale, t } from "@/lib/i18n";
import { SkipLink } from "@/components/chrome/skip-link";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { ThemeManager } from "@/components/chrome/theme-manager";
import { ui } from "@/content/ui";

// The locale set is closed: only /en and /fr are prerendered, anything else 404s.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

// Runs before first paint: marks JS as available (so scroll-reveal can hide its
// initial state) and applies the persisted/system theme — avoiding any flash.
const bootScript = `(function(){var e=document.documentElement;e.classList.add('js');try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)e.classList.add('dark');}catch(_){}})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

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
        <LocaleProvider locale={locale}>
          <ThemeManager />
          <SkipLink label={t(ui.actions.skipToContent, locale)} />
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
        </LocaleProvider>
      </body>
    </html>
  );
}
