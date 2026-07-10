"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { scrollState } from "@/lib/scroll-state";

// WebGL is client-only; load it lazily so it never blocks first paint.
const Scene = dynamic(() => import("./scene").then((m) => m.Scene), {
  ssr: false,
});

/**
 * Fixed full-viewport WebGL backdrop for the immersive home. Also feeds the
 * page's scroll progress into the shared scrollState the scene reads each
 * frame. Renders nothing under reduced motion — the site works without it.
 */
export function CanvasRoot() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    scrollState.page = value;
  });

  // Mount after hydration so the canvas never delays the first paint.
  useEffect(() => setMounted(true), []);

  // Feed the pointer to the scene: the world leans toward the visitor's hand.
  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      scrollState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  if (reducedMotion || !mounted) return null;

  return (
    // Fade the world in so it arrives instead of popping.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <Scene />
    </motion.div>
  );
}
