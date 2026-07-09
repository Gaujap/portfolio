"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll-reveal wrapper: fades + lifts its children into view once on entry.
 *
 * The hidden initial state lives in CSS, gated on `html.js` and on
 * `prefers-reduced-motion: no-preference` (see globals.css). So with JS off the
 * content is simply visible, and with reduced motion it appears instantly — the
 * observer here only flips `data-revealed` to trigger the transition, once.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.setAttribute("data-revealed", "true");
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
