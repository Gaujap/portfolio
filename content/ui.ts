import type { Dictionary } from "@/content/types";

/**
 * Every UI string on the site. Add a string here (with both locales) and read
 * it with `t(ui.section.key, locale)`. The `satisfies Dictionary` check makes a
 * missing translation a build error.
 */
export const ui = {
  nav: {
    home: { en: "Home", fr: "Accueil" },
    ai: { en: "AI", fr: "IA" },
    security: { en: "Security", fr: "Sécurité" },
    engineering: { en: "Engineering", fr: "Ingénierie" },
    about: { en: "About", fr: "À propos" },
  },
  actions: {
    contact: { en: "Get in touch", fr: "Me contacter" },
    email: { en: "Email", fr: "Email" },
    viewProject: { en: "View project", fr: "Voir le projet" },
    readWriteup: { en: "Read the write-up", fr: "Lire l'étude de cas" },
    backHome: { en: "Back to home", fr: "Retour à l'accueil" },
    skipToContent: { en: "Skip to content", fr: "Aller au contenu" },
    toggleTheme: { en: "Toggle theme", fr: "Changer de thème" },
    switchLanguage: { en: "Switch language", fr: "Changer de langue" },
  },
  sections: {
    selectedWork: { en: "Selected work", fr: "Projets sélectionnés" },
    now: { en: "Now", fr: "En ce moment" },
    capabilities: { en: "Capabilities", fr: "Compétences" },
    experience: { en: "Experience", fr: "Expérience" },
    contact: { en: "Contact", fr: "Contact" },
    languages: { en: "Languages", fr: "Langues" },
    projects: { en: "Projects", fr: "Projets" },
    architecture: { en: "Architecture", fr: "Architecture" },
  },
  diagrams: {
    hermes: {
      en: "Hermes voice pipeline: wake word to speech-to-text to LLM to Piper text-to-speech, with a local Qwen model and a Claude Haiku cloud fallback.",
      fr: "Pipeline vocal Hermes : mot d'activation vers reconnaissance vocale vers LLM vers synthèse vocale Piper, avec un modèle Qwen en local et un repli cloud Claude Haiku.",
    },
  },
  labels: {
    private: { en: "Private", fr: "Privé" },
    inProduction: { en: "In production", fr: "En production" },
    inDevelopment: { en: "In development", fr: "En développement" },
    current: { en: "Current", fr: "En cours" },
    primaryFocus: { en: "Primary focus", fr: "Focus principal" },
  },
  contact: {
    lead: {
      en: "Have a project, a role, or a problem worth solving?",
      fr: "Un projet, un poste, ou un problème qui vaut la peine d'être résolu ?",
    },
  },
  work: {
    problem: { en: "Problem", fr: "Problème" },
    constraints: { en: "Constraints", fr: "Contraintes" },
    approach: { en: "Approach", fr: "Approche" },
    shipped: { en: "What shipped", fr: "Ce qui a été livré" },
    retrospective: {
      en: "What I'd do differently",
      fr: "Ce que je referais autrement",
    },
  },
} satisfies Dictionary;
