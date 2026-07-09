import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Explicit registry of MDX write-up bodies. Static import specifiers (rather
 * than a template-literal dynamic import) keep bundling deterministic — every
 * write-up is a known module. Keyed by `${slug}.${locale}`.
 */
const writeups: Record<string, () => Promise<{ default: ComponentType }>> = {
  "hermes.en": () => import("./hermes.en.mdx"),
  "hermes.fr": () => import("./hermes.fr.mdx"),
  "vybe.en": () => import("./vybe.en.mdx"),
  "vybe.fr": () => import("./vybe.fr.mdx"),
  "notion-mcp-pipeline.en": () => import("./notion-mcp-pipeline.en.mdx"),
  "notion-mcp-pipeline.fr": () => import("./notion-mcp-pipeline.fr.mdx"),
  "hybrid-network.en": () => import("./hybrid-network.en.mdx"),
  "hybrid-network.fr": () => import("./hybrid-network.fr.mdx"),
  "ski-theatre-scheduling.en": () => import("./ski-theatre-scheduling.en.mdx"),
  "ski-theatre-scheduling.fr": () => import("./ski-theatre-scheduling.fr.mdx"),
};

/** Load a project's write-up body for a locale, or null if none exists. */
export async function loadWriteup(
  slug: string,
  locale: Locale,
): Promise<ComponentType | null> {
  const load = writeups[`${slug}.${locale}`];
  if (!load) return null;
  const mod = await load();
  return mod.default;
}
