import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Level = 1 | 2 | 3 | 4;

// Display serif, one size step per level. Pages override via className.
const sizes: Record<Level, string> = {
  1: "text-4xl sm:text-5xl md:text-6xl leading-[1.05]",
  2: "text-3xl sm:text-4xl leading-tight",
  3: "text-xl sm:text-2xl leading-snug",
  4: "text-lg leading-snug",
};

/** Serif display heading. `level` sets both the tag and the default size. */
export function Heading({
  level = 2,
  id,
  children,
  className,
}: {
  level?: Level;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return (
    <Tag
      id={id}
      className={cn(
        "font-display tracking-tight text-balance",
        sizes[level],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
