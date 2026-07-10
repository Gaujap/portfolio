import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small mono uppercase label that sits above a heading. */
export function Eyebrow({
  children,
  accent,
  className,
  id,
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <p
      id={id}
      className={cn(
        "font-mono text-xs uppercase tracking-widest",
        accent ? "text-accent" : "text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
