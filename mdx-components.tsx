import type { MDXComponents } from "mdx/types";

/**
 * Maps MDX elements to the site's editorial styling. Required at the repo root
 * by @next/mdx. Write-ups use `##`/`###` headings, paragraphs, lists, and
 * inline code; everything resolves to design tokens so prose matches the site.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-12 font-display text-2xl tracking-tight text-fg first:mt-0"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-8 font-display text-xl tracking-tight text-fg" {...props} />
    ),
    p: (props) => (
      <p className="mt-4 leading-relaxed text-muted" {...props} />
    ),
    ul: (props) => (
      <ul
        className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-accent"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-muted marker:text-accent"
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
