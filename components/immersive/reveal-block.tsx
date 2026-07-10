"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Rises into view once on scroll. Reduced motion renders in place. */
export function RevealBlock({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
