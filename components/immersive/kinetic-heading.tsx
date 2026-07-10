"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { parseEmphasis, toWords } from "@/lib/emphasis";

/**
 * A heading that assembles itself word by word on load — the home hero's
 * signature entrance, reusable on any page opening. `[[emphasis]]` markers
 * render in the accent. Reduced motion renders it instantly.
 */
export function KineticHeading({
  text,
  className,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => toWords(parseEmphasis(text)), [text]);

  return (
    <Tag className={className} aria-label={words.map((w) => w.word).join(" ")}>
      {words.map((entry, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={
            reducedMotion ? false : { opacity: 0, y: 22, filter: "blur(9px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.25 + i * 0.055,
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            "mr-[0.26em] inline-block will-change-transform",
            entry.emphasized && "text-accent italic",
          )}
        >
          {entry.word}{" "}
        </motion.span>
      ))}
    </Tag>
  );
}
