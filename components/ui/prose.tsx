import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Body copy at a comfortable reading measure (~62 characters). */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[62ch] text-base leading-relaxed text-muted [&_p+p]:mt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
