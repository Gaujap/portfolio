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

// The site is dark by default (regardless of system preference), so the
// browser chrome matches the warm dark stage.
export const viewport: Viewport = {
  themeColor: "#17150F",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
