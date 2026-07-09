import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-accent text-accent-contrast hover:opacity-90",
  ghost: "border border-line text-fg hover:border-accent hover:text-accent",
} as const;

function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

/**
 * Link styled as a button. Renders `next/link` for internal routes and a plain
 * anchor (with safe rel) for external/mailto targets — so it stays a server
 * component with no client JS.
 */
export function Button({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
    variants[variant],
    className,
  );

  if (isExternal(href)) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Inline, underlined text link with the same internal/external handling. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = cn(
    "font-medium text-accent underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80",
    className,
  );

  if (isExternal(href)) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
