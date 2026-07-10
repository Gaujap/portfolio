"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Tag, TextLink } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import type { Project } from "@/content/types";

const AUTO_ADVANCE_MS = 6000;

/** Direction-aware slide variants: enter from the side you're moving toward. */
const variants = {
  enter: (direction: 1 | -1) => ({ x: direction * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ x: direction * -48, opacity: 0 }),
};

/**
 * The home stage: one project full-frame at a time. Auto-advances every 6s
 * (progress bar shows the rhythm) until the visitor interacts — hover, drag,
 * arrows, or keyboard all pause it for good. Under reduced motion there is no
 * autoplay and slides swap instantly.
 */
export function ProjectCarousel({
  projects,
  locale,
}: {
  projects: Project[];
  locale: Locale;
}) {
  const reducedMotion = useReducedMotion();
  const [[index, direction], setSlide] = useState<[number, 1 | -1]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const count = projects.length;
  const project = projects[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      setSlide(([current]) => [(current + dir + count) % count, dir]);
    },
    [count],
  );

  // Any deliberate interaction stops the autoplay permanently.
  const interact = useCallback(() => setPaused(true), []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setTimeout(() => go(1), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [index, paused, reducedMotion, go]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      interact();
      go(1);
    } else if (event.key === "ArrowLeft") {
      interact();
      go(-1);
    }
  }

  const autoplaying = !paused && !reducedMotion;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t(ui.sections.selectedWork, locale)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={interact}
      className="outline-none"
    >
      <div className="flex items-baseline justify-between">
        <Eyebrow id="work-eyebrow" as="h2">
          {t(ui.sections.selectedWork, locale)}
        </Eyebrow>
        <p className="font-mono text-xs tabular-nums text-muted" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>

      {/* The stage. Fixed min-height so slides of different length don't jump. */}
      <div className="relative mt-10 min-h-[340px] sm:min-h-[300px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={project.slug}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
            drag={reducedMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={interact}
            onDragEnd={(_, info) => {
              if (info.offset.x < -64 || info.velocity.x < -400) go(1);
              else if (info.offset.x > 64 || info.velocity.x > 400) go(-1);
            }}
            aria-label={`${index + 1} / ${count}`}
            className="cursor-grab active:cursor-grabbing"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {t(ui.nav[project.primaryAngle], locale)} ·{" "}
              {t(project.period, locale)}
            </p>

            <h3 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              {project.name}
            </h3>

            <p className="mt-4 max-w-[38ch] font-display text-xl italic text-muted sm:text-2xl">
              {t(project.tagline, locale)}
            </p>

            <ul aria-label="Stack" className="mt-6 flex max-w-2xl flex-wrap gap-2">
              {project.stack.slice(0, 6).map((item, i) => (
                <motion.li
                  key={item}
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                >
                  <Tag>{item}</Tag>
                </motion.li>
              ))}
            </ul>

            {project.hasWriteup && (
              <div className="mt-8">
                <TextLink href={`/${locale}/work/${project.slug}`}>
                  {t(ui.actions.readWriteup, locale)} →
                </TextLink>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6">
        {/* Autoplay progress — restarts per slide, hidden once paused. */}
        <div className="h-px flex-1 bg-line" aria-hidden="true">
          {autoplaying && (
            <motion.div
              key={index}
              className="h-px origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label={t(ui.carousel.previous, locale)}
            onClick={() => {
              interact();
              go(-1);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={t(ui.carousel.next, locale)}
            onClick={() => {
              interact();
              go(1);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            →
          </button>
        </div>
      </div>

      {/* Dot navigation, one per project. */}
      <div className="mt-4 flex gap-2">
        {projects.map((entry, i) => (
          <button
            key={entry.slug}
            type="button"
            aria-label={entry.name}
            aria-current={i === index ? "true" : undefined}
            onClick={() => {
              interact();
              setSlide([i, i > index ? 1 : -1]);
            }}
            className={
              i === index
                ? "h-1.5 w-6 rounded-full bg-accent transition-all"
                : "h-1.5 w-1.5 rounded-full bg-line transition-all hover:bg-muted"
            }
          />
        ))}
      </div>
    </div>
  );
}
