"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container, Eyebrow, Button } from "@/components/ui";
import { KineticText } from "@/components/immersive/kinetic-text";
import { ship } from "@/lib/ship";

export interface FinaleSocial {
  label: string;
  href: string;
}

/**
 * The immersive ending: the "now" line and the contact ask both written in by
 * the scroll, and — the ship's last mission — when the contact section comes
 * on stage, it flies down and parks beside the email button, handing over the
 * pen. All copy arrives pre-localised.
 */
export function Finale({
  nowLabel,
  nowText,
  contactLabel,
  contactLead,
  emailLabel,
  email,
  socials,
}: {
  nowLabel: string;
  nowText: string;
  contactLabel: string;
  contactLead: string;
  emailLabel: string;
  email: string;
  socials: FinaleSocial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();
  // Which button the ship is presenting; null = resting default (email filled).
  const [focused, setFocused] = useState<number | null>(null);

  // The ship's last mission: introduce each way to reach me — the presented
  // button lights up — then come home and park on the email.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const count = 1 + socials.length;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Higher priority than the console: the ending owns the ship.
          ship.publish(
            "finale",
            [
              ...Array.from({ length: count }, (_, i) => ({
                id: `contact-${i}`,
                order: i,
                getRect: () =>
                  buttonRefs.current[i]?.getBoundingClientRect() ?? null,
                focus: () => setFocused(i),
                blur: () =>
                  setFocused((current) => (current === i ? null : current)),
              })),
              {
                id: "contact-park",
                order: 99,
                park: true,
                getRect: () =>
                  buttonRefs.current[0]?.getBoundingClientRect() ?? null,
                focus: () => setFocused(0),
              },
            ],
            20,
          );
        } else {
          ship.retract("finale");
          setFocused(null);
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      ship.retract("finale");
    };
  }, [reducedMotion, socials.length]);

  return (
    <>
      <section aria-labelledby="now-eyebrow" className="border-t border-line py-[14vh]">
        <Container>
          <Eyebrow id="now-eyebrow" as="h2">
            {nowLabel}
          </Eyebrow>
          <KineticText
            text={nowText}
            className="mt-6 max-w-[34ch] font-display text-2xl leading-snug tracking-tight sm:text-3xl"
          />
        </Container>
      </section>

      <section
        ref={sectionRef}
        id="contact"
        aria-labelledby="contact-eyebrow"
        className="border-t border-line py-[16vh]"
      >
        <Container>
          <Eyebrow id="contact-eyebrow" as="h2" accent>
            {contactLabel}
          </Eyebrow>
          <KineticText
            text={contactLead}
            className="mt-6 max-w-[24ch] font-display text-3xl leading-snug tracking-tight sm:text-5xl"
          />
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {/* The ship tours these one by one; only the one it presents is
                filled. At rest (or without the ship) the email leads. */}
            <div
              ref={(el) => {
                buttonRefs.current[0] = el;
              }}
              className="inline-block"
            >
              <Button
                href={`mailto:${email}`}
                variant={focused === null || focused === 0 ? "primary" : "ghost"}
              >
                {emailLabel}
              </Button>
            </div>
            {socials.map((social, i) => (
              <div
                key={social.href}
                ref={(el) => {
                  buttonRefs.current[i + 1] = el;
                }}
                className="inline-block"
              >
                <Button
                  href={social.href}
                  variant={focused === i + 1 ? "primary" : "ghost"}
                >
                  {social.label}
                </Button>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>
    </>
  );
}
