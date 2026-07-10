import type { Localized } from "@/lib/i18n";

/**
 * Copy for the immersive home. `[[word]]` marks emphasis — the kinetic text
 * components render those spans in the accent colour. Keep the markers out of
 * `content/site.ts` (its strings feed metadata/OG where markers would leak).
 */

export interface HomeStat {
  /** Numeric part, animated by the counter. */
  value: number;
  prefix?: string;
  suffix?: string;
  label: Localized;
  /** Hidden depth: revealed on hover/tap of the stat. */
  detail: Localized;
}

export const home: {
  thesis: Localized;
  manifesto: Localized[];
  stats: HomeStat[];
  anglesLead: Localized;
  explore: Localized;
  scrollHint: Localized;
} = {
  thesis: {
    en: "I build [[AI systems]] that run in [[production]], not in slide decks.",
    fr: "Je conçois des [[systèmes d'IA]] qui tournent en [[production]], pas dans des slides.",
  },
  manifesto: [
    {
      en: "Most AI work never leaves the [[demo]].",
      fr: "La plupart des projets d'IA ne quittent jamais la [[démo]].",
    },
    {
      en: "Mine ships — a [[voice assistant]] answering on my own hardware, a [[payments-grade]] platform built by three people, a [[live migration]] no school ever noticed.",
      fr: "Les miens sont livrés — un [[assistant vocal]] qui répond sur mon propre matériel, une plateforme [[prête pour les paiements]] construite à trois, une [[migration en production]] qu'aucune école n'a remarquée.",
    },
    {
      en: "One identity, three angles: [[AI]], [[security]], [[engineering]].",
      fr: "Une identité, trois angles : [[IA]], [[sécurité]], [[ingénierie]].",
    },
  ],
  stats: [
    {
      value: 63,
      prefix: "~",
      suffix: " tok/s",
      label: {
        en: "local inference on a consumer GPU", // TODO: verify
        fr: "d'inférence locale sur GPU grand public",
      },
      detail: {
        en: "Qwen 2.5 14B on an RX 7900 XTX via ROCm — the cloud is a fallback, not the default.",
        fr: "Qwen 2.5 14B sur RX 7900 XTX via ROCm — le cloud est un repli, pas le défaut.",
      },
    },
    {
      value: 30,
      prefix: "~",
      label: {
        en: "schools live through a zero-downtime migration", // TODO: verify
        fr: "écoles en production pendant une migration sans coupure",
      },
      detail: {
        en: "Legacy Django stays live while Vue 3 / Quasar replaces it screen by screen.",
        fr: "Le legacy Django reste en ligne pendant que Vue 3 / Quasar le remplace écran par écran.",
      },
    },
    {
      value: 6,
      label: {
        en: "projects run by one agent pipeline",
        fr: "projets pilotés par un même pipeline agentique",
      },
      detail: {
        en: "Claude Code + Notion + GitHub MCP — a queue-table pattern keeps the agents honest.",
        fr: "Claude Code + Notion + GitHub MCP — un motif de table-file garde les agents fiables.",
      },
    },
    {
      value: 95,
      suffix: "%",
      label: {
        en: "reliability before any new feature ships",
        fr: "de fiabilité avant toute nouvelle fonctionnalité",
      },
      detail: {
        en: "Hermes' design rule: three or four workflows that always work beat ten that mostly do.",
        fr: "La règle d'Hermes : trois ou quatre workflows qui marchent toujours valent mieux que dix qui marchent souvent.",
      },
    },
  ],
  anglesLead: {
    en: "Pick your angle",
    fr: "Choisis ton angle",
  },
  explore: { en: "Explore the project", fr: "Explorer le projet" },
  scrollHint: { en: "Scroll", fr: "Défiler" },
};
