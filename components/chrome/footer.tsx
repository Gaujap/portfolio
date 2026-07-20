import { Container, TextLink } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";

/** Site footer: identity, contact links, copyright. */
export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg tracking-tight">{site.name}</p>
          <p className="mt-1 text-sm text-muted">
            {t(site.role, locale)} · {t(site.location, locale)}
          </p>
        </div>

        <nav aria-label="Contact" className="flex flex-wrap items-center gap-4">
          <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
          {site.socials.map((social) => (
            <TextLink key={social.href} href={social.href}>
              {social.label}
            </TextLink>
          ))}
        </nav>
      </Container>

      <Container className="border-t border-line py-6">
        <p className="font-mono text-xs text-muted">
          © {year} {site.name}
        </p>
      </Container>
    </footer>
  );
}
