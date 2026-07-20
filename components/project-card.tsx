import { Heading, TagList, TextLink } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import type { Angle, Project } from "@/content/types";

/**
 * Renders a project either neutrally (home) or in a specific angle's framing
 * (angle pages). Pass `angle` to reframe: the card then uses that angle's
 * headline, summary, and highlighted stack when the project supports it.
 */
export function ProjectCard({
  project,
  locale,
  angle,
}: {
  project: Project;
  locale: Locale;
  angle?: Angle;
}) {
  const framing = angle ? project.angles[angle] : undefined;

  const lead = framing ? t(framing.headline, locale) : t(project.tagline, locale);
  const summary = framing ? t(framing.summary, locale) : t(project.summary, locale);
  const stack = framing ? framing.stack : project.stack;

  const status = project.isPrivate
    ? t(ui.labels.private, locale)
    : project.links.some((link) => link.kind === "live")
      ? t(ui.labels.inProduction, locale)
      : null;

  return (
    <article className="border-t border-line pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Heading level={3}>{project.name}</Heading>
        <p className="font-mono text-xs text-muted">{t(project.period, locale)}</p>
      </div>

      <p className="mt-3 font-display text-lg italic text-muted">{lead}</p>

      <p className="mt-4 max-w-[62ch] leading-relaxed">{summary}</p>

      <TagList items={stack} label="Stack" className="mt-5" />

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {project.hasWriteup && (
          <TextLink href={`/${locale}/work/${project.slug}`}>
            {t(ui.actions.readWriteup, locale)} →
          </TextLink>
        )}
        {project.links.map((link) => (
          <TextLink key={link.href} href={link.href}>
            {t(link.label, locale)} →
          </TextLink>
        ))}
        {status && (
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {status}
          </span>
        )}
      </div>
    </article>
  );
}
