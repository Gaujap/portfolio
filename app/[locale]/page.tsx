import type { Metadata } from "next";
import { Section, Container, Reveal, Eyebrow } from "@/components/ui";
import { SmoothScroll } from "@/components/immersive/smooth-scroll";
import { CanvasRoot } from "@/components/immersive/canvas-root";
import { Hero } from "@/components/immersive/hero";
import { Manifesto } from "@/components/immersive/manifesto";
import { ProjectConsole } from "@/components/immersive/project-console";
import { Contact } from "@/components/contact";
import { pageMetadata } from "@/lib/seo";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { seo } from "@/content/seo";
import { home } from "@/content/home";
import { angles } from "@/content/angles";
import { ANGLES } from "@/content/types";
import { projects } from "@/content/projects";

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

/*
 * The immersive home: a WebGL field behind everything, the thesis assembling
 * on arrival, a manifesto the scroll writes in, full-screen project scenes,
 * then now + contact. All copy resolved here, server-side — the client
 * components only stage what they're given.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const consoleProjects = projects.map((project) => ({
    slug: project.slug,
    name: project.name,
    meta: `${t(ui.nav[project.primaryAngle], locale)} · ${t(project.period, locale)}`,
    tagline: t(project.tagline, locale),
    stack: project.stack.slice(0, 6),
    href: `/${locale}/work/${project.slug}`,
    cta: t(home.explore, locale),
    facts: project.facts.map((fact) => ({
      label: t(fact.label, locale),
      detail: t(fact.detail, locale),
    })),
  }));

  return (
    <SmoothScroll>
      <CanvasRoot />
      <div className="relative z-10">
        <Hero
          role={t(site.role, locale)}
          thesis={t(home.thesis, locale)}
          scrollHint={t(home.scrollHint, locale)}
        />

        <Manifesto
          lines={home.manifesto.map((line) => t(line, locale))}
          stats={home.stats.map((stat) => ({
            value: stat.value,
            prefix: stat.prefix,
            suffix: stat.suffix,
            label: t(stat.label, locale),
            detail: t(stat.detail, locale),
          }))}
          anglesLead={t(home.anglesLead, locale)}
          angleLinks={ANGLES.map((angle) => ({
            href: `/${locale}/${angle}`,
            label: t(angles[angle].label, locale),
          }))}
        />

        <ProjectConsole
          heading={t(ui.sections.selectedWork, locale)}
          projects={consoleProjects}
        />

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
      </div>
    </SmoothScroll>
  );
}
