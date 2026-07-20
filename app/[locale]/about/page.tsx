import type { Metadata } from "next";
import { Section, Container, Reveal, Eyebrow } from "@/components/ui";
import { SmoothScroll } from "@/components/immersive/smooth-scroll";
import { CanvasRoot } from "@/components/immersive/canvas-root";
import { ShipGuide } from "@/components/immersive/ship-guide";
import { WorkGuide } from "@/components/immersive/work-guide";
import { KineticHeading } from "@/components/immersive/kinetic-heading";
import { KineticText } from "@/components/immersive/kinetic-text";
import { ExperienceList } from "@/components/experience-list";
import { Contact } from "@/components/contact";
import { pageMetadata } from "@/lib/seo";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { seo } from "@/content/seo";
import { about } from "@/content/about";
import { experience } from "@/content/experience";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/about",
    title: t(seo.about.title, locale),
    description: t(seo.about.description, locale),
  });
}

/* Trajectory, not autobiography — told in the immersive language. */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <SmoothScroll>
      <CanvasRoot presence={0.35} />
      <ShipGuide />
      <WorkGuide />

      <div className="relative z-10">
        <Section labelledBy="about-heading" className="pt-20 sm:pt-28">
          <Container>
            <Eyebrow accent>{t(ui.nav.about, locale)}</Eyebrow>
            <KineticHeading
              text={site.name}
              className="mt-6 max-w-[20ch] font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
            />
            <div className="mt-10 space-y-8">
              {about.intro.map((paragraph) => (
                <KineticText
                  key={paragraph.en}
                  text={t(paragraph, locale)}
                  className="max-w-[52ch] font-display text-xl leading-snug tracking-tight sm:text-2xl"
                />
              ))}
            </div>
          </Container>
        </Section>

        <Reveal>
          <Section labelledBy="about-exp" className="border-t border-line">
            <Container>
              <Eyebrow id="about-exp" as="h2">
                {t(ui.sections.experience, locale)}
              </Eyebrow>
              <div className="mt-8">
                <ExperienceList items={experience} locale={locale} />
              </div>
            </Container>
          </Section>
        </Reveal>

        <Reveal>
          <Section labelledBy="about-langs" className="border-t border-line">
            <Container>
              <Eyebrow id="about-langs" as="h2">
                {t(ui.sections.languages, locale)}
              </Eyebrow>
              <ul className="mt-6 space-y-2">
                {site.languages.map((entry) => (
                  <li key={entry.language.en} className="text-lg">
                    <span className="font-display">
                      {t(entry.language, locale)}
                    </span>
                    <span className="text-muted"> — {t(entry.level, locale)}</span>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        </Reveal>

        <Contact locale={locale} />
      </div>
    </SmoothScroll>
  );
}
