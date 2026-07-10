import { Section, Container, Reveal, Eyebrow, Heading } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { SkillsGrid } from "@/components/skills-grid";
import { ExperienceList } from "@/components/experience-list";
import { HermesDiagram } from "@/components/hermes-diagram";
import { Contact } from "@/components/contact";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { angles } from "@/content/angles";
import { projectsForAngle } from "@/content/projects";
import { skillsForAngle } from "@/content/skills";
import { experienceForAngle } from "@/content/experience";
import type { Angle } from "@/content/types";

/**
 * Shared shape for /ai, /security, /engineering. Same structure, content pulled
 * from each angle's framing: positioning → projects (in this angle's framing) →
 * capabilities → experience → contact. The AI angle also surfaces the Hermes
 * architecture diagram.
 */
export function AnglePage({
  angle,
  locale,
}: {
  angle: Angle;
  locale: Locale;
}) {
  const data = angles[angle];
  const projects = projectsForAngle(angle);
  const skills = skillsForAngle(angle);
  const roles = experienceForAngle(angle);

  return (
    <>
      <Section labelledBy="angle-heading" className="pt-20 sm:pt-28">
        <Container>
          <Eyebrow accent>{t(data.label, locale)}</Eyebrow>
          <Heading id="angle-heading" level={1} className="mt-6 max-w-[24ch]">
            {t(data.positioning, locale)}
          </Heading>
        </Container>
      </Section>

      {angle === "ai" && (
        <Reveal>
          <Section labelledBy="angle-arch" className="border-t border-line">
            <Container>
              <Eyebrow id="angle-arch" as="h2">
                {t(ui.sections.architecture, locale)}
              </Eyebrow>
              <div className="mt-8 max-w-3xl">
                <HermesDiagram label={t(ui.diagrams.hermes, locale)} />
              </div>
            </Container>
          </Section>
        </Reveal>
      )}

      <Reveal>
        <Section labelledBy="angle-projects" className="border-t border-line">
          <Container>
            <Eyebrow id="angle-projects" as="h2">
              {t(ui.sections.projects, locale)}
            </Eyebrow>
            <div className="mt-8 space-y-12">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                  angle={angle}
                />
              ))}
            </div>
          </Container>
        </Section>
      </Reveal>

      <Reveal>
        <Section labelledBy="angle-caps" className="border-t border-line">
          <Container>
            <Eyebrow id="angle-caps" as="h2">
              {t(ui.sections.capabilities, locale)}
            </Eyebrow>
            <div className="mt-8">
              <SkillsGrid groups={skills} locale={locale} />
            </div>
          </Container>
        </Section>
      </Reveal>

      {roles.length > 0 && (
        <Reveal>
          <Section labelledBy="angle-exp" className="border-t border-line">
            <Container>
              <Eyebrow id="angle-exp" as="h2">
                {t(ui.sections.experience, locale)}
              </Eyebrow>
              <div className="mt-8">
                <ExperienceList items={roles} locale={locale} />
              </div>
            </Container>
          </Section>
        </Reveal>
      )}

      <Contact locale={locale} />
    </>
  );
}
