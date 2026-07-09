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
  primaryAngle: Angle;
  /** Per-angle reframings. Only the angles this project supports are present. */
  angles: Partial<Record<Angle, AngleFraming>>;
  /** Empty when the project is private (no source or live link). */
  links: ProjectLink[];
  /** Private repo: show architecture, not code — no source/live link. */
  isPrivate: boolean;
  /** Has a long-form MDX write-up at /work/[slug]. */
  hasWriteup: boolean;
  /** Surfaced in the home page "selected work". */
  featured: boolean;
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
