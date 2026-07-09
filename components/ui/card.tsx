import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Subtle bordered surface, used where content benefits from being boxed. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-line p-6 sm:p-8", className)}>
      {children}
    </div>
  );
}
