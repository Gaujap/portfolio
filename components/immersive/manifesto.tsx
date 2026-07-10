"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Container, TextLink } from "@/components/ui";
import { KineticText, Counter } from "@/components/immersive/kinetic-text";

export interface AngleLink {
  href: string;
  label: string;
}

export interface ManifestoStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Hidden depth, revealed on hover / focus / tap. */
  detail: string;
}

/**
 * The narrative spine of the home: three statements the scroll writes in, a
 * proof strip whose numbers count up — each hiding a deeper line for whoever
 * hovers — then the three angle doors. Copy arrives pre-localised.
 */
export function Manifesto({
  lines,
  stats,
  anglesLead,
  angleLinks,
}: {
  lines: string[];
  stats: ManifestoStat[];
  anglesLead: string;
  angleLinks: AngleLink[];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative">
      <Container className="space-y-[16vh] py-[18vh]">
        {lines.map((line) => (
          <KineticText
            key={line}
            text={line}
            className="max-w-[26ch] font-display text-3xl leading-snug tracking-tight sm:text-5xl"
          />
        ))}
      </Container>

      {/* Proof strip — hover/tap a number, get the story behind it. */}
      <Container className="grid grid-cols-2 gap-x-8 gap-y-12 border-t border-line py-[12vh] md:grid-cols-4">
        {stats.map((stat) => (
          <StatBlock key={stat.label} stat={stat} />
        ))}
      </Container>

      {/* Three doors. */}
      <Container className="border-t border-line py-[10vh]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {anglesLead}
        </p>
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:gap-12">
          {angleLinks.map((angle, i) => (
            <motion.div
              key={angle.href}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <TextLink
                href={angle.href}
                className="font-display text-2xl italic sm:text-3xl"
              >
                {angle.label} →
              </TextLink>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatBlock({ stat }: { stat: ManifestoStat }) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Reduced motion shows everything, no interaction required.
  if (reducedMotion) {
    return (
      <div>
        <p className="font-display text-5xl tracking-tight text-accent sm:text-6xl">
          {stat.prefix}
          {stat.value}
          {stat.suffix}
        </p>
        <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-muted">
          {stat.label}
        </p>
        <p className="mt-2 max-w-[26ch] text-sm leading-relaxed">{stat.detail}</p>
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((current) => !current)}
      className="group cursor-help outline-none"
    >
      <Counter
        value={stat.value}
        prefix={stat.prefix}
        suffix={stat.suffix}
        className={cn(
          "font-display text-5xl tracking-tight text-accent transition-opacity sm:text-6xl",
          open && "opacity-90",
        )}
      />
      <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-muted">
        {stat.label}
      </p>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="mt-2 max-w-[26ch] border-l border-accent pl-3 text-sm leading-relaxed"
          >
            {stat.detail}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
