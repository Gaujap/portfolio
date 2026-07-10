import type { Metadata } from "next";
import { SmoothScroll } from "@/components/immersive/smooth-scroll";
import { CanvasRoot } from "@/components/immersive/canvas-root";
import { ShipGuide } from "@/components/immersive/ship-guide";
import { Hero } from "@/components/immersive/hero";
import { Manifesto } from "@/components/immersive/manifesto";
import { ProjectConsole } from "@/components/immersive/project-console";
import { Finale } from "@/components/immersive/finale";
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
      <ShipGuide />
      <div className="relative z-10">
        <Hero
          role={t(site.role, locale)}
          thesis={t(home.thesis, locale)}
          cta={t(ui.actions.contact, locale)}
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
          linkBase={`/${locale}/`}
        />

        <ProjectConsole
          heading={t(ui.sections.selectedWork, locale)}
          projects={consoleProjects}
        />

        <Finale
          nowLabel={t(ui.sections.now, locale)}
          nowText={t(site.now, locale)}
          contactLabel={t(ui.sections.contact, locale)}
          contactLead={t(ui.contact.lead, locale)}
          emailLabel={t(ui.actions.email, locale)}
          email={site.email}
          socials={site.socials}
        />
      </div>
    </SmoothScroll>
  );
}
