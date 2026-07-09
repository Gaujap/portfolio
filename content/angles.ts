import type { Angle, AnglePage } from "@/content/types";

/**
 * The three entry points. Each reframes the same underlying work — so `/ai`,
 * `/security`, and `/engineering` read as focused specialists, not a generalist.
 * `positioning` heads the angle page; `teaser` is the home-page card sentence.
 */
export const angles = {
  ai: {
    label: { en: "AI systems", fr: "Systèmes d'IA" },
    positioning: {
      en: "AI systems engineering: orchestration, local inference, and tool routing built to survive contact with production.",
      fr: "Ingénierie de systèmes d'IA : orchestration, inférence locale et routage d'outils conçus pour tenir en production.",
    },
    teaser: {
      en: "Local-first LLM orchestration, agent workflows, and the plumbing that makes them reliable.",
      fr: "Orchestration de LLM en local, workflows agentiques, et la tuyauterie qui les rend fiables.",
    },
  },
  security: {
    label: { en: "Security", fr: "Sécurité" },
    positioning: {
      en: "Security-minded engineering: network segmentation, threat modelling, and a defensive posture built in from the first commit.",
      fr: "Ingénierie orientée sécurité : segmentation réseau, modélisation des menaces et posture défensive dès le premier commit.",
    },
    teaser: {
      en: "Network architecture, threat modelling, and pre-launch security posture.",
      fr: "Architecture réseau, modélisation des menaces et posture de sécurité avant lancement.",
    },
  },
  engineering: {
    label: { en: "Engineering", fr: "Ingénierie" },
    positioning: {
      en: "Full-stack product engineering: platforms shipped by small teams, and migrations that keep production live throughout.",
      fr: "Ingénierie produit full-stack : des plateformes livrées par de petites équipes, et des migrations qui gardent la production en vie.",
    },
    teaser: {
      en: "Full-stack platforms, legacy migrations, and product engineering under real constraints.",
      fr: "Plateformes full-stack, migrations de legacy et ingénierie produit sous contraintes réelles.",
    },
  },
} satisfies Record<Angle, AnglePage>;
