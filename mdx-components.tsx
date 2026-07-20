import { Children } from "react";
import type { MDXComponents } from "mdx/types";
import { RevealBlock } from "@/components/immersive/reveal-block";
import { KineticText } from "@/components/immersive/kinetic-text";

/**
 * Maps MDX elements to the immersive editorial styling. Required at the repo
 * root by @next/mdx. Write-up sections read in two layers: the h2 becomes a
 * small mono eyebrow, the <Lead> right under it is the big serif takeaway a
 * skimmer reads, and the muted prose below carries the depth.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    /**
     * The skim layer: one per section, right under the heading. Reading only
     * the five <Lead> lines tells the project's whole story. Available in MDX
     * without import.
     */
    Lead: ({ children }: { children: React.ReactNode }) => (
      // The scroll writes the takeaway in, word by word — the same kinetic
      // signature as the home. Leads are authored as plain text.
      <KineticText
        text={Children.toArray(children).join("")}
        className="lead mt-5 max-w-[30ch] font-display text-2xl leading-snug tracking-tight text-fg sm:text-3xl"
      />
    ),
    h2: (props) => (
      <RevealBlock>
        <h2
          className="mt-16 font-mono text-xs uppercase tracking-widest text-accent first:mt-0"
          {...props}
        />
      </RevealBlock>
    ),
    h3: (props) => (
      <h3 className="mt-8 font-display text-xl tracking-tight text-fg" {...props} />
    ),
    p: (props) => <p className="mt-5 leading-relaxed text-muted" {...props} />,
    ul: (props) => (
      <ul
        className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-accent"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mt-5 list-decimal space-y-2 pl-5 leading-relaxed text-muted marker:text-accent"
        {...props}
      />
    ),
    li: (props) => <li className="pl-1" {...props} />,
    a: (props) => (
      <a
        className="text-accent underline decoration-1 underline-offset-4 hover:opacity-80"
        {...props}
      />
    ),
    strong: (props) => <strong className="font-semibold text-fg" {...props} />,
    code: (props) => (
      <code
        className="rounded bg-line/60 px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
        {...props}
      />
    ),
    hr: () => <hr className="my-10 border-line" />,
    ...components,
  };
}
