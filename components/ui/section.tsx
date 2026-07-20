import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A semantic section with the site's vertical rhythm. */
export function Section({
  id,
  labelledBy,
  children,
  className,
}: {
  id?: string;
  /** id of the heading that names this section, for `aria-labelledby`. */
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-16 sm:py-24", className)}
    >
      {children}
    </section>
  );
}
