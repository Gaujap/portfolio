import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small mono uppercase label that sits above a heading. */
export function Eyebrow({
  children,
  accent,
  className,
  id,
  as: Tag = "p",
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
  id?: string;
  /** Use "h2" when the eyebrow is a section title, for a correct heading outline. */
  as?: "p" | "h2";
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-mono text-xs uppercase tracking-widest",
        accent ? "text-accent" : "text-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
