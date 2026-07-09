import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// NOTE: This root layout is temporary. The i18n step introduces `app/[locale]/`
// which will own <html lang={locale}>; this file then becomes a pass-through.

export const metadata: Metadata = {
  title: "Gabriel Debarnot",
  description: "Full-stack developer specialising in AI systems.",
};

// Set the theme class before first paint to avoid a flash of the wrong theme.
const noFlashTheme = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
