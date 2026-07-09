import Link from "next/link";
import { Container } from "@/components/ui";
import { NavLink } from "@/components/chrome/nav-link";
import { LanguageToggle } from "@/components/chrome/language-toggle";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";

/** Site header: brand (→ home), primary nav, language + theme toggles. */
export function Header({ locale }: { locale: Locale }) {
  const nav = [
    { href: `/${locale}/ai`, label: t(ui.nav.ai, locale) },
    { href: `/${locale}/security`, label: t(ui.nav.security, locale) },
    { href: `/${locale}/engineering`, label: t(ui.nav.engineering, locale) },
    { href: `/${locale}/about`, label: t(ui.nav.about, locale) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="font-display text-lg tracking-tight transition-opacity hover:opacity-80"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-5 sm:gap-6">
          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
            {nav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <div className="flex items-center gap-2 border-l border-line pl-4 sm:pl-5">
            <LanguageToggle locale={locale} label={t(ui.actions.switchLanguage, locale)} />
            <ThemeToggle label={t(ui.actions.toggleTheme, locale)} />
          </div>
        </div>
      </Container>
    </header>
  );
}
