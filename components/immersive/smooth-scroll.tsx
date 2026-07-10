"use client";

import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

/**
 * The active Lenis instance, exposed so other components (the project console's
 * index rail) can drive programmatic smooth scrolls through the same engine.
 * Null when smooth scrolling is off (reduced motion, or before mount).
 */
export const lenisRef: { current: Lenis | null } = { current: null };

/**
 * Lenis smooth scrolling — the glide that makes scroll-scrubbed scenes feel
 * cinematic instead of notchy. Native scroll stays the source of truth, so
 * framer-motion's useScroll keeps working. Disabled under reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
    lenisRef.current = lenis;
    return () => {
      lenisRef.current = null;
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}

/** Smooth-scroll to an absolute Y, through Lenis when active. */
export function scrollToY(y: number) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(y, { duration: 1.1 });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
