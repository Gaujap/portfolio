"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { parseEmphasis, toWords } from "@/lib/emphasis";
import { scrollToY } from "@/components/immersive/smooth-scroll";
import { Container } from "@/components/ui";

/**
 * The opening scene: the thesis assembles itself word by word over the WebGL
 * field the moment you arrive — blur lifting, emphasis igniting in accent.
 * Plays once; reduced motion renders it instantly.
 */
export function Hero({
  role,
  thesis,
  cta,
  scrollHint,
}: {
  role: string;
  thesis: string;
  /** Label of the contact shortcut — the one action available above the fold. */
  cta: string;
  scrollHint: string;
}) {
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => toWords(parseEmphasis(thesis)), [thesis]);

  const entrance = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center">
      {/* Warm aura behind the thesis, from the design tokens. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 42%, color-mix(in oklab, var(--accent) 13%, transparent), transparent 72%)",
        }}
      />

      <Container>
        <motion.p
          {...entrance(0.15)}
          className="font-mono text-xs uppercase tracking-widest text-accent"
        >
          {role}
        </motion.p>

        <h1
          className="mt-8 max-w-[16ch] font-display text-5xl leading-[1.04] tracking-tight sm:text-7xl lg:text-8xl"
          aria-label={words.map((w) => w.word).join(" ")}
        >
          {words.map((entry, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              {...entrance(0.4 + i * 0.085)}
              className={cn(
                // inline-block (needed for transforms) swallows trailing
                // spaces, so word gaps come from the margin instead.
                "mr-[0.26em] inline-block will-change-transform",
                entry.emphasized && "text-accent italic",
              )}
            >
              {entry.word}
            </motion.span>
          ))}
        </h1>

        {/* Quiet conversion path for the visitor who's already convinced. */}
        <motion.div {...entrance(1.35)} className="mt-10">
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              const target = document.getElementById("contact");
              if (target) {
                scrollToY(window.scrollY + target.getBoundingClientRect().top);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {cta} ↓
          </a>
        </motion.div>
      </Container>

      <motion.div
        {...entrance(1.8)}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {scrollHint}
        </span>
        {/* A quiet pulse running down a hairline — the only looping motion. */}
        <span className="relative h-10 w-px overflow-hidden bg-line">
          {!reducedMotion && (
            <motion.span
              className="absolute left-0 top-0 h-4 w-px bg-accent"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn" }}
            />
          )}
        </span>
      </motion.div>
    </section>
  );
}
