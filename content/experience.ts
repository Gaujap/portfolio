import type { Angle, Experience } from "@/content/types";

/**
 * Roles, most recent first. `angles` controls which angle pages surface each
 * role. Checked with `satisfies Experience[]` — a missing field fails the build.
 */
export const experience = [
  {
    company: "Winway / Vybe",
    role: {
      en: "Lead Developer — full-stack, AI, security",
      fr: "Lead Developer — full-stack, IA, sécurité",
    },
    period: { en: "Since Mar 2025", fr: "Depuis mars 2025" },
    current: true,
    summary: {
      en: "Creator-economy platform. Three-person team, equity holder.",
      fr: "Plateforme creator-economy. Équipe de trois, détenteur de parts.",
    },
    highlights: [
      {
        en: "Building the pre-fundraising demo.",
        fr: "Construction de la démo pré-levée de fonds.",
      },
      {
        en: "Designing the in-product AI assistant and content-ranking logic.",
        fr: "Conception de l'assistant IA intégré et de la logique de classement de contenu.",
      },
      {
        en: "Leading the pre-launch security posture.",
        fr: "Pilotage de la posture de sécurité avant lancement.",
      },
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "Fastify",
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "Stripe Connect",
      "Cloudflare R2",
    ],
    angles: ["engineering", "ai", "security"],
  },
  {
    company: "2C2L",
    role: {
      en: "Full-Stack Developer — apprenticeship",
      fr: "Développeur full-stack — alternance",
    },
    period: {
      en: "Since Mar 2025 (through Sept 2027)",
      fr: "Depuis mars 2025 (jusqu'en sept. 2027)",
    },
    current: true,
    summary: {
      en: "Principal engineer on the migration of a legacy Django scheduling platform to Vue 3 / Quasar, serving ~30 ski and theatre schools in production, and designing the backing API. Three-person team.",
      fr: "Ingénieur principal sur la migration d'une plateforme de planification Django legacy vers Vue 3 / Quasar, au service d'une trentaine d'écoles de ski et de théâtre en production, et conception de l'API sous-jacente. Équipe de trois.",
    },
    highlights: [
      {
        en: "Migrating a live production system with zero downtime tolerated.",
        fr: "Migration d'un système en production sans interruption tolérée.",
      },
      {
        en: "Designing the backing API for the new front end.",
        fr: "Conception de l'API sous-jacente pour le nouveau front.",
      },
    ],
    stack: ["Vue 3", "Quasar", "Django", "PostgreSQL"],
    angles: ["engineering"],
  },
  {
    company: "GDT — gdtx.fr",
    role: { en: "Founder", fr: "Fondateur" },
    period: { en: "Since Oct 2025", fr: "Depuis octobre 2025" },
    current: true,
    summary: {
      en: "Web development for local institutions and AI consulting for SMEs. Diagnostic-first engagements.",
      fr: "Développement web pour institutions locales et conseil en IA pour PME. Missions orientées diagnostic d'abord.",
    },
    highlights: [],
    stack: [],
    angles: ["engineering", "ai"],
  },
] satisfies Experience[];

/** Roles that surface on a given angle page, in order. */
export function experienceForAngle(angle: Angle): Experience[] {
  return experience.filter((role) => role.angles.some((a) => a === angle));
}
