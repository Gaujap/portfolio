"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

// Endonyms: the accessible name must contain the visible text ("en" ⊂ "English",
// "fr" ⊂ "Français") to satisfy WCAG "Label in Name".
const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/**
 * Switches locale while staying on the current page: swaps the leading path
 * segment and persists the choice to the `NEXT_LOCALE` cookie (the signal the
 * middleware reads on the next bare-path visit).
 */
export function LanguageToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const other: Locale = locale === "en" ? "fr" : "en";
  const href = pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${other}`);

  function persist() {
    document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000;samesite=lax`;
  }

  return (
    <Link
      href={href}
      hrefLang={other}
      onClick={persist}
      aria-label={LANGUAGE_NAMES[other]}
      title={label}
      className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-fg"
    >
      {other}
    </Link>
  );
}
