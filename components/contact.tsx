import { Section, Container, Eyebrow, Heading, Button } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";

/** Shared contact block, reused on the home and angle pages. */
export function Contact({ locale }: { locale: Locale }) {
  return (
    <Section id="contact" labelledBy="contact-eyebrow" className="border-t border-line">
      <Container>
        <Eyebrow id="contact-eyebrow" accent>
          {t(ui.sections.contact, locale)}
        </Eyebrow>
        <Heading level={2} className="mt-4 max-w-[22ch]">
          {t(ui.contact.lead, locale)}
        </Heading>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`mailto:${site.email}`}>
            {t(ui.actions.email, locale)}
          </Button>
          {site.socials.map((social) => (
            <Button key={social.href} href={social.href} variant="ghost">
              {social.label}
            </Button>
          ))}
        </div>
      </Container>
    </Section>
  );
}
