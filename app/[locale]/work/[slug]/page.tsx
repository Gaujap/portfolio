import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Container, Eyebrow, Heading, TagList, TextLink } from "@/components/ui";
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

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();

  const Body = await loadWriteup(slug, locale);
  if (!Body) notFound();

  return (
    <Section className="pt-16 sm:pt-24">
      <Container>
        <TextLink href={`/${locale}`}>← {t(ui.actions.backHome, locale)}</TextLink>

        <header className="mt-8">
          <Eyebrow accent>{t(project.tagline, locale)}</Eyebrow>
          <Heading level={1} className="mt-4">
            {project.name}
          </Heading>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            <span>{t(project.period, locale)}</span>
            <span aria-hidden="true">·</span>
            <span>{t(project.role, locale)}</span>
          </div>
          <TagList items={project.stack} label="Stack" className="mt-6" />
        </header>

        {project.slug === "hermes" && (
          <div className="mt-12 max-w-3xl">
            <HermesDiagram label={t(ui.diagrams.hermes, locale)} />
          </div>
        )}

        <div className="mt-12 max-w-[68ch]">
          <Body />
        </div>

        {project.links.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-4 border-t border-line pt-6">
            {project.links.map((link) => (
              <TextLink key={link.href} href={link.href}>
                {t(link.label, locale)} →
              </TextLink>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
