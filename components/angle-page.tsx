import { Section, Container, Reveal, Eyebrow } from "@/components/ui";
import { SmoothScroll } from "@/components/immersive/smooth-scroll";
import { CanvasRoot } from "@/components/immersive/canvas-root";
import { ShipGuide } from "@/components/immersive/ship-guide";
import { WorkGuide } from "@/components/immersive/work-guide";
import { KineticHeading } from "@/components/immersive/kinetic-heading";
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

/** Each angle's flagship form (index into the scene's FORMS/projects order). */
const FLAGSHIP_FORM: Record<Angle, number> = {
  ai: 0, // Hermes waveform ring
  security: 6, // bridged clusters (Hybrid network)
  engineering: 2, // Vybe ranking stack
};

/**
 * Shared shape for /ai, /security, /engineering — in the immersive language:
 * the angle's flagship form burns in the backdrop, the positioning statement
 * assembles on arrival, sections rise in as you read with the ship presenting
 * each one. Content pulled from each angle's framing.
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
    <SmoothScroll>
      <CanvasRoot fixedForm={FLAGSHIP_FORM[angle]} presence={0.45} />
      <ShipGuide />
      <WorkGuide />

      <div className="relative z-10">
        <Section labelledBy="angle-heading" className="pt-20 sm:pt-28">
          <Container>
            <Eyebrow accent>{t(data.label, locale)}</Eyebrow>
            <KineticHeading
              text={t(data.positioning, locale)}
              className="mt-6 max-w-[24ch] font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            />
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
      </div>
    </SmoothScroll>
  );
}
