"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  motion,
  animate,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/cn";
import { parseEmphasis, toWords } from "@/lib/emphasis";

/**
 * Scroll-scrubbed text: words materialise one by one as the reader scrolls,
 * retract when scrolling back, and `[[emphasised]]` words render in the
 * accent. Under reduced motion the text is simply there, emphasis intact.
 */
export function KineticText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => toWords(parseEmphasis(text)), [text]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  if (reducedMotion) {
    return (
      <p className={className}>
        {words.map((entry, i) => (
          <span key={i} className={entry.emphasized ? "text-accent italic" : undefined}>
            {entry.word}{" "}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className} aria-label={words.map((w) => w.word).join(" ")}>
      {words.map((entry, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          start={(i / words.length) * 0.85}
          end={(i / words.length) * 0.85 + 0.15}
          emphasized={entry.emphasized}
        >
          {entry.word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  progress,
  start,
  end,
  emphasized,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  emphasized: boolean;
  children: string;
}) {
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, y }}
      className={cn(
        // inline-block (needed for transforms) swallows trailing spaces, so
        // word gaps come from the margin instead.
        "mr-[0.26em] inline-block will-change-transform",
        emphasized && "text-accent italic",
      )}
    >
      {children}
    </motion.span>
  );
}

/**
 * A number that counts itself up when it enters the viewport — once. The
 * proof strip uses these so the figures feel earned, not stated.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {reducedMotion ? value : display}
      {suffix}
    </span>
  );
}
