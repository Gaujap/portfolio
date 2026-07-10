"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/cn";
import { scrollState } from "@/lib/scroll-state";
import { scrollToY } from "@/components/immersive/smooth-scroll";
import { Container, Tag, TextLink } from "@/components/ui";

export interface ConsoleFact {
  label: string;
  detail: string;
}

export interface ConsoleProject {
  slug: string;
  name: string;
  meta: string;
  tagline: string;
  stack: string[];
  href: string;
  cta: string;
  facts: ConsoleFact[];
}

/** Scroll runway per project, in viewport-heights. */
const SLOT_VH = 85;

/** Preset marker positions around the 3D centerpiece (right half of stage). */
const MARKER_POSITIONS = [
  { top: "16%", right: "24%" },
  { top: "34%", right: "6%" },
  { top: "60%", right: "28%" },
  { top: "76%", right: "10%" },
];

/**
 * The pinned project console. The stage stays fixed while scroll (or the index
 * rail) switches projects — the WebGL centerpiece morphs behind, the dossier
 * crossfades in front, and hotspot markers around the object reveal facts on
 * hover/tap. One screen, five projects, no dead scroll between them.
 */
export function ProjectConsole({
  heading,
  projects,
}: {
  heading: string;
  projects: ConsoleProject[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [openFact, setOpenFact] = useState<number | null>(null);

  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.min(count - 1, Math.max(0, Math.floor(value * count)));
    setActive(index);
    scrollState.activeProject = index;
  });

  // The centerpiece lights up while the console is on stage.
  const { scrollYProgress: viewProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const presence = useTransform(viewProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  useMotionValueEvent(presence, "change", (value) => {
    scrollState.projectsPresence = value;
  });

  // Changing project closes any open callout.
  useEffect(() => setOpenFact(null), [active]);

  function jumpTo(index: number) {
    const container = containerRef.current;
    if (!container) return;
    const top = window.scrollY + container.getBoundingClientRect().top;
    const runway = container.offsetHeight - window.innerHeight;
    scrollToY(top + (runway * (index + 0.5)) / count);
  }

  // Reduced motion: no pinning, no scrubbing — a plain, complete list.
  if (reducedMotion) {
    return (
      <section aria-label={heading}>
        <h2 className="sr-only">{heading}</h2>
        <Container className="space-y-20 py-24">
          {projects.map((project) => (
            <article key={project.slug} className="border-t border-line pt-8">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {project.meta}
              </p>
              <h3 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                {project.name}
              </h3>
              <p className="mt-3 max-w-[40ch] font-display text-lg italic text-muted">
                {project.tagline}
              </p>
              <ul className="mt-5 space-y-2">
                {project.facts.map((fact) => (
                  <li key={fact.label} className="text-sm leading-relaxed">
                    <span className="font-mono text-accent">{fact.label}</span>{" "}
                    <span className="text-muted">— {fact.detail}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <TextLink href={project.href}>{project.cta} →</TextLink>
              </div>
            </article>
          ))}
        </Container>
      </section>
    );
  }

  const project = projects[active];

  return (
    <div
      ref={containerRef}
      style={{ height: `calc(${count * SLOT_VH}vh + 100svh)` }}
    >
      <section
        aria-label={heading}
        className="sticky top-0 flex h-[100svh] items-center overflow-hidden"
      >
        <h2 className="sr-only">{heading}</h2>

        <Container className="w-full">
          {/* Index rail — horizontal on mobile, vertical right on desktop. */}
          <nav
            aria-label={heading}
            className="mb-8 flex gap-4 sm:absolute sm:right-8 sm:top-1/2 sm:mb-0 sm:-translate-y-1/2 sm:flex-col"
          >
            {projects.map((entry, i) => (
              <button
                key={entry.slug}
                type="button"
                aria-label={entry.name}
                aria-current={i === active ? "true" : undefined}
                onClick={() => jumpTo(i)}
                className={cn(
                  "font-mono text-xs tabular-nums transition-colors",
                  i === active
                    ? "text-accent"
                    : "text-muted/50 hover:text-muted",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {project.meta}
              </p>

              <h3 className="mt-5 font-display text-5xl leading-[1.0] tracking-tight sm:text-7xl">
                {project.name}
              </h3>

              <p className="mt-5 max-w-[36ch] font-display text-lg italic text-muted sm:text-2xl">
                {project.tagline}
              </p>

              <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>

              {/* Mobile depth: facts as tappable chips (markers are desktop). */}
              <div className="mt-6 lg:hidden">
                <div className="flex flex-wrap gap-2">
                  {project.facts.map((fact, i) => (
                    <button
                      key={fact.label}
                      type="button"
                      aria-expanded={openFact === i}
                      onClick={() => setOpenFact(openFact === i ? null : i)}
                      className={cn(
                        "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                        openFact === i
                          ? "border-accent text-accent"
                          : "border-line text-muted",
                      )}
                    >
                      {fact.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {openFact !== null && project.facts[openFact] && (
                    <motion.p
                      key={openFact}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 max-w-[44ch] text-sm leading-relaxed text-muted"
                    >
                      {project.facts[openFact].detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8">
                <TextLink
                  href={project.href}
                  className="font-mono text-sm uppercase tracking-widest"
                >
                  {project.cta} →
                </TextLink>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop depth: hotspot markers orbiting the centerpiece. */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
            {project.facts.slice(0, MARKER_POSITIONS.length).map((fact, i) => (
              <div
                key={`${project.slug}-${fact.label}`}
                className="pointer-events-auto absolute"
                style={MARKER_POSITIONS[i]}
              >
                <button
                  type="button"
                  aria-expanded={openFact === i}
                  onClick={() => setOpenFact(openFact === i ? null : i)}
                  onMouseEnter={() => setOpenFact(i)}
                  onFocus={() => setOpenFact(i)}
                  className="group flex items-center gap-2"
                >
                  <span className="relative flex h-3 w-3">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50",
                        openFact === i && "animate-none",
                      )}
                    />
                    <span className="relative inline-flex h-3 w-3 rounded-full border border-accent bg-bg" />
                  </span>
                  <span
                    className={cn(
                      "font-mono text-xs transition-colors",
                      openFact === i
                        ? "text-accent"
                        : "text-muted group-hover:text-fg",
                    )}
                  >
                    {fact.label}
                  </span>
                </button>

                {/* Callout anchors right so markers near the viewport edge
                    open inward instead of clipping. */}
                <AnimatePresence>
                  {openFact === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="absolute right-0 top-full z-10 mt-2 w-64 rounded-md border border-line bg-bg/90 p-3 backdrop-blur"
                    >
                      <p className="text-sm leading-relaxed text-muted">
                        {fact.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
