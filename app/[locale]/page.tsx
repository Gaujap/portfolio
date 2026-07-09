import Link from "next/link";
import { t, type Locale, type Localized } from "@/lib/i18n";

/*
 * Placeholder home that proves the locale plumbing end-to-end (routing,
 * `params` → `t()`, and switching). The real editorial home is built in the
 * pages step; the temporary locale links here are replaced by the header.
 */

const thesis: Localized = {
  en: "I build AI systems that run in production, not in slide decks.",
  fr: "Je conçois des systèmes d'IA qui tournent en production, pas dans des slides.",
};

const other: Record<Locale, { href: string; label: string }> = {
  en: { href: "/fr", label: "Français" },
  fr: { href: "/en", label: "English" },
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const switchTo = other[locale];

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {locale.toUpperCase()} · placeholder
      </p>
      <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
        {t(thesis, locale)}
      </h1>
      <Link
        href={switchTo.href}
        className="mt-10 inline-block font-mono text-sm text-muted underline underline-offset-4 hover:text-accent"
      >
        → {switchTo.label}
      </Link>
    </main>
  );
}
