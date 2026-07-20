import type { Localized } from "@/lib/i18n";

/**
 * Content interfaces. Everything the site renders is data shaped by these types
 * — copy never lives in JSX. Because content arrays are declared with
 * `satisfies` against these interfaces, a missing required field fails the
 * build (`tsc`/`next build`) rather than shipping a hole.
 */

/** The three entry-point framings of one identity. */
export const ANGLES = ["ai", "security", "engineering"] as const;
export type Angle = (typeof ANGLES)[number];

/**
 * Angle-specific reframing of a project. The same project renders differently
 * depending on which angle page you arrive from — same substance, different
 * emphasis.
 */
export interface AngleFraming {
  headline: Localized;
  summary: Localized;
  /** Subset of the project's stack to highlight for this angle. */
  stack: string[];
}

/**
 * One explorable data point on the home console: `label` is the short line a
 * hotspot shows collapsed, `detail` the 1–2 lines revealed on hover/tap.
 */
export interface ProjectFact {
  label: Localized;
  detail: Localized;
}

export type ProjectLinkKind = "repo" | "live" | "writeup" | "external";

export interface ProjectLink {
  label: Localized;
  href: string;
  kind: ProjectLinkKind;
}

export interface Project {
  /** URL segment and stable identifier. */
  slug: string;
  /** Proper noun — not localized. */
  name: string;
  period: Localized;
  role: Localized;
  /** Angle-neutral one-liner, used on the home page. */
  tagline: Localized;
  /** Angle-neutral paragraph. */
  summary: Localized;
  /** Full stack; angle framings highlight a subset. */
  stack: string[];
  /** Explorable data points on the home console (max 4 render as hotspots). */
  facts: ProjectFact[];
  primaryAngle: Angle;
  /** Per-angle reframings. Only the angles this project supports are present. */
  angles: Partial<Record<Angle, AngleFraming>>;
  /** Empty when the project is private (no source or live link). */
  links: ProjectLink[];
  /** Private repo: show architecture, not code — no source/live link. */
  isPrivate: boolean;
  /** Has a long-form MDX write-up at /work/[slug]. */
  hasWriteup: boolean;
}

export interface Experience {
  company: string;
  role: Localized;
  period: Localized;
  current: boolean;
  summary: Localized;
  highlights: Localized[];
  stack: string[];
  /** Angle pages that surface this role. */
  angles: Angle[];
}

export interface Skill {
  name: string;
  angles: Angle[];
}

export interface SkillGroup {
  category: Localized;
  angles: Angle[];
  items: Skill[];
}

/* --- Singletons: site config, angle pages, UI dictionary --- */

export interface SocialLink {
  label: string;
  href: string;
}

export interface LanguageProficiency {
  language: Localized;
  level: Localized;
}

export interface SiteConfig {
  /** Proper noun — not localized. */
  name: string;
  /** Canonical production origin, e.g. https://gabrieldebarnot.gdtx.fr */
  url: string;
  role: Localized;
  location: Localized;
  email: string;
  socials: SocialLink[];
  /** The load-bearing claim on the home page. */
  thesis: Localized;
  /** Short, frequently-updated "what I'm building now". */
  now: Localized;
  languages: LanguageProficiency[];
}

export interface AnglePage {
  label: Localized;
  /** Positioning statement at the top of the angle page. */
  positioning: Localized;
  /** One-sentence framing used on the home angle cards. */
  teaser: Localized;
}

/**
 * Nested UI-string dictionary. Typing content against this with `satisfies`
 * forces every leaf to provide all locales, so a missing translation is a
 * build error rather than a silent fallback.
 */
export type Dictionary = { [key: string]: Localized | Dictionary };
