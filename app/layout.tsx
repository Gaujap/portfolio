import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import "./globals.css";

/*
 * Pass-through root layout. The <html>/<body> shell lives in `[locale]/layout`
 * so `lang` can be set from the resolved locale. Global styles are imported
 * here because this layout wraps every route.
 */

// metadataBase makes canonical/alternate/OG URLs absolute in production.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

// Match the theme toggle: warm paper (light) / warm dark grey (dark) chrome.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F1" },
    { media: "(prefers-color-scheme: dark)", color: "#17150F" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
