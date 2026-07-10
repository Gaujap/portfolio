import type { Metadata } from "next";
import { Section, Container, Reveal, Eyebrow, Heading, Button } from "@/components/ui";
import { AngleCard } from "@/components/angle-card";
import { ProjectCard } from "@/components/project-card";
import { Contact } from "@/components/contact";
import { pageMetadata } from "@/lib/seo";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { seo } from "@/content/seo";
import { ANGLES } from "@/content/types";
import { featuredProjects } from "@/content/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "",
    title: t(seo.home.title, locale),
    description: t(seo.home.description, locale),
    absoluteTitle: true,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* Hero — the thesis is the load-bearing element. */}
      <Section labelledBy="hero-heading" className="pt-20 sm:pt-28">
        <Container>
          <Eyebrow accent>{t(site.role, locale)}</Eyebrow>
          <Heading id="hero-heading" level={1} className="mt-6 max-w-[18ch]">
            {t(site.thesis, locale)}
          </Heading>
          <div className="mt-10">
            <Button href="#contact">{t(ui.actions.contact, locale)}</Button>
          </div>
        </Container>
      </Section>

      {/* Three angles — genuine framings, not a nav menu. */}
      <Reveal>
        <Section labelledBy="angles-eyebrow" className="border-t border-line">
          <Container>
            <Eyebrow id="angles-eyebrow" as="h2">
              {t(ui.sections.angles, locale)}
            </Eyebrow>
            <p className="mt-4 max-w-[46ch] font-display text-2xl leading-snug">
              {t(ui.home.anglesLead, locale)}
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {ANGLES.map((angle, index) => (
                <AngleCard
                  key={angle}
                  angle={angle}
                  locale={locale}
                  index={index + 1}
                />
              ))}
            </div>
          </Container>
        </Section>
      </Reveal>

      {/* Selected work — angle-neutral framing. */}
      <Reveal>
        <Section labelledBy="work-eyebrow" className="border-t border-line">
          <Container>
            <Eyebrow id="work-eyebrow" as="h2">
              {t(ui.sections.selectedWork, locale)}
            </Eyebrow>
            <div className="mt-8 space-y-12">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={locale} />
              ))}
            </div>
          </Container>
        </Section>
      </Reveal>

      {/* Now — easy to update. */}
      <Reveal>
        <Section labelledBy="now-eyebrow" className="border-t border-line">
          <Container>
            <Eyebrow id="now-eyebrow" as="h2">
              {t(ui.sections.now, locale)}
            </Eyebrow>
            <p className="mt-4 max-w-[62ch] font-display text-xl leading-snug">
              {t(site.now, locale)}
            </p>
          </Container>
        </Section>
      </Reveal>

      <Contact locale={locale} />
    </>
  );
}
