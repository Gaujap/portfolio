import type { SiteConfig } from "@/content/types";

/**
 * Site-wide singleton: identity, contact, thesis, and the "now" line.
 * Edit `now` freely — it is meant to change often.
 */
export const site = {
  name: "Gabriel Debarnot",
  role: {
    en: "Full-stack developer — AI systems",
    fr: "Développeur full-stack — systèmes d'IA",
  },
  location: { en: "Lyon, France", fr: "Lyon, France" },
  email: "pro@gdtx.fr",
  socials: [
    { label: "GitHub", href: "https://github.com/gaujap" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gabriel-debarnot" },
  ],
  thesis: {
    en: "I build AI systems that run in production, not in slide decks.",
    fr: "Je conçois des systèmes d'IA qui tournent en production, pas dans des slides.",
  },
  now: {
    en: "Building the pre-fundraising demo for Vybe — its in-product AI assistant, its content-ranking logic, and its pre-launch security posture.",
    fr: "Je construis la démo pré-levée de Vybe — son assistant IA intégré, sa logique de classement de contenu et sa posture de sécurité avant lancement.",
  },
  languages: [
    {
      language: { en: "French", fr: "Français" },
      level: { en: "Native", fr: "Langue maternelle" },
    },
    {
      language: { en: "English", fr: "Anglais" },
      level: {
        en: "Professional working proficiency (B2)",
        fr: "Usage professionnel (B2)",
      },
    },
  ],
} satisfies SiteConfig;
