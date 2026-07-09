import type { ReactNode } from "react";
import "./globals.css";

/*
 * Pass-through root layout. The <html>/<body> shell lives in `[locale]/layout`
 * so `lang` can be set from the resolved locale. Global styles are imported
 * here because this layout wraps every route.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
