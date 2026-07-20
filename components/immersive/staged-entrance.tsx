"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Staged entrance for a page's opening: each direct child rises in, one after
 * the other, once on mount. The page title stays OUTSIDE — it must not
 * double-animate. Reduced motion renders everything immediately.
 */
export function StagedEntrance({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <>
      {Children.map(children, (child, i) =>
        child == null ? null : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15 + i * 0.16,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {child}
          </motion.div>
        ),
      )}
    </>
  );
}
