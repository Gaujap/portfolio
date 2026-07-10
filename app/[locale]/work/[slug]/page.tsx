import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Container, Eyebrow, Heading, TagList, TextLink } from "@/components/ui";
import { SmoothScroll } from "@/components/immersive/smooth-scroll";
import { CanvasRoot } from "@/components/immersive/canvas-root";
import { ShipGuide } from "@/components/immersive/ship-guide";
import { WorkGuide } from "@/components/immersive/work-guide";
import { StagedEntrance } from "@/components/immersive/staged-entrance";
import { HermesDiagram } from "@/components/hermes-diagram";
import { loadWriteup } from "@/content/projects/writeups";
import { projects, PROJECT_SLUGS } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";

// Close the slug set; combined with [locale] this prerenders every locale × slug.
export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: project.name,
    description: t(project.tagline, locale),
  });
}

/*
 * The immersive project dossier: the project's own thematic form burns in the
 * backdrop, the header lands first and the rest assembles, sections rise in as
 * you read with the ship perched on the current heading, and the ending offers
 * the next project.
 */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  const index = projects.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];

  const Body = await loadWriteup(slug, locale);
  if (!Body) notFound();

  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <SmoothScroll>
      <CanvasRoot fixedForm={index} presence={0.5} />
      <ShipGuide />
      <WorkGuide />

      <div className="relative z-10">
        <Section className="pt-16 sm:pt-24">
          <Container>
            <TextLink href={`/${locale}`}>
              ← {t(ui.actions.backHome, locale)}
            </TextLink>

            <header className="mt-10">
              <Eyebrow accent>{t(project.tagline, locale)}</Eyebrow>
              <Heading
                level={1}
                className="mt-5 text-5xl sm:text-7xl lg:text-8xl"
              >
                {project.name}
              </Heading>
            </header>

            <StagedEntrance>
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
                  <span>{t(project.period, locale)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t(project.role, locale)}</span>
                </div>
                <TagList items={project.stack} label="Stack" className="mt-6" />
              </div>

              {project.slug === "hermes" ? (
                <div className="mt-12 max-w-3xl">
                  <HermesDiagram label={t(ui.diagrams.hermes, locale)} />
                </div>
              ) : null}

              <div className="mt-14 max-w-[68ch]">
                <Body />
              </div>

              {project.links.length > 0 ? (
                <div className="mt-12 flex flex-wrap gap-4 border-t border-line pt-6">
                  {project.links.map((link) => (
                    <TextLink key={link.href} href={link.href}>
                      {t(link.label, locale)} →
                    </TextLink>
                  ))}
                </div>
              ) : null}
            </StagedEntrance>

            {/* Continuation: the ship parks beside "next project". */}
            <nav
              aria-label={t(ui.sections.projects, locale)}
              className="mt-20 flex items-center justify-between gap-6 border-t border-line pt-8"
            >
              <Link
                href={`/${locale}/work/${previous.slug}`}
                className="group text-left"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  ← {t(ui.work.previousProject, locale)}
                </span>
                <span className="mt-1 block font-display text-xl tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                  {previous.name}
                </span>
              </Link>
              <Link
                id="work-next"
                href={`/${locale}/work/${next.slug}`}
                className="group text-right"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  {t(ui.work.nextProject, locale)} →
                </span>
                <span className="mt-1 block font-display text-xl tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                  {next.name}
                </span>
              </Link>
            </nav>
          </Container>
        </Section>
      </div>
    </SmoothScroll>
  );
}
