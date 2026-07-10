import { Section, Container, Reveal, Eyebrow, Heading } from "@/components/ui";
import { ExperienceList } from "@/components/experience-list";
import { Contact } from "@/components/contact";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { about } from "@/content/about";
import { experience } from "@/content/experience";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Section labelledBy="about-heading" className="pt-20 sm:pt-28">
        <Container>
          <Eyebrow accent>{t(ui.nav.about, locale)}</Eyebrow>
          <Heading id="about-heading" level={1} className="mt-6 max-w-[20ch]">
            {site.name}
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-4">
            {about.intro.map((paragraph) => (
              <p key={paragraph.en} className="text-lg leading-relaxed text-muted">
                {t(paragraph, locale)}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      <Reveal>
        <Section labelledBy="about-exp" className="border-t border-line">
          <Container>
            <Eyebrow id="about-exp">{t(ui.sections.experience, locale)}</Eyebrow>
            <div className="mt-8">
              <ExperienceList items={experience} locale={locale} />
            </div>
          </Container>
        </Section>
      </Reveal>

      <Reveal>
        <Section labelledBy="about-langs" className="border-t border-line">
          <Container>
            <Eyebrow id="about-langs">{t(ui.sections.languages, locale)}</Eyebrow>
            <ul className="mt-6 space-y-2">
              {site.languages.map((entry) => (
                <li key={entry.language.en} className="text-lg">
                  <span className="font-display">{t(entry.language, locale)}</span>
                  <span className="text-muted"> — {t(entry.level, locale)}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </Reveal>

      <Contact locale={locale} />
    </>
  );
}
