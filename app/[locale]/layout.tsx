import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { fontVariables } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/locale-context";
import { LOCALES, isLocale } from "@/lib/i18n";

// The locale set is closed: only /en and /fr are prerendered, anything else 404s.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

// Applies the persisted (or system) theme before first paint — no flash.
const noFlashTheme = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

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
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
