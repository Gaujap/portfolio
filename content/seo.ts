import type { Localized } from "@/lib/i18n";
import type { Angle } from "@/content/types";

/**
 * Per-page titles and descriptions. Titles are short — the layout appends
 * "· Gabriel Debarnot" via a template (except the home page, which is absolute).
 */
export const seo = {
  home: {
    title: {
      en: "Gabriel Debarnot — AI systems engineer",
      fr: "Gabriel Debarnot — ingénieur systèmes d'IA",
    },
    description: {
      en: "Full-stack developer specialising in AI systems that run in production. Based in Lyon, France.",
      fr: "Développeur full-stack spécialisé dans les systèmes d'IA qui tournent en production. Basé à Lyon, France.",
    },
  },
  about: {
    title: { en: "About", fr: "À propos" },
    description: {
      en: "Trajectory, roles, and how I work — full-stack, AI systems, and security.",
      fr: "Parcours, rôles et façon de travailler — full-stack, systèmes d'IA et sécurité.",
    },
  },
} satisfies Record<string, { title: Localized; description: Localized }>;

/** Angle-page SEO derives from the angle framing to avoid duplicating copy. */
export const angleSeoTitle: Record<Angle, Localized> = {
  ai: { en: "AI systems", fr: "Systèmes d'IA" },
  security: { en: "Security", fr: "Sécurité" },
  engineering: { en: "Engineering", fr: "Ingénierie" },
};
