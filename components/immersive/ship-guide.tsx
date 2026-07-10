"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ship, type ShipTarget } from "@/lib/ship";

/** How long the ship studies each point before moving on. */
const DWELL_MS = 2400;
/** Grace period after targets change before a new tour starts (fast-scroll guard). */
const SETTLE_MS = 450;
/** Close enough to a target to count as arrived. */
const ARRIVAL_PX = 12;
/** How long after the last scroll movement the ship considers you settled. */
const SCROLL_QUIET_MS = 320;
/** Idle patrol time before an asteroid may wander in. */
const ASTEROID_MIN_MS = 6000;
const ASTEROID_MAX_MS = 14000;

type Mode = "drift" | "settle" | "tour" | "parked";

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
}

/**
 * The ship guide. Its manners, in order:
 * - It tours published targets and parks; while you scroll it holds its spot
 *   on screen and lets the page flow underneath — it only glides (once) when
 *   YOU settle. No frame-by-frame chasing, no nose-flipping.
 * - Arrival is shown by lighting the target (halo), not by drawing lines.
 * - With nothing to do it patrols lazily — and now and then an asteroid
 *   drifts by, and it does what ships do.
 * Desktop-only, absent under reduced motion.
 */
export function ShipGuide() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useSpring(useMotionValue(-60), { stiffness: 46, damping: 13 });
  const y = useSpring(useMotionValue(-60), { stiffness: 46, damping: 13 });
  const rotate = useMotionValue(0);

  const flame = useRef<HTMLSpanElement>(null);
  const laser = useRef<HTMLSpanElement>(null);
  const asteroidEl = useRef<HTMLSpanElement>(null);
  const fragmentEls = useRef<Array<HTMLSpanElement | null>>([]);

  // Flight state lives in refs — the loop runs at 60fps without re-renders.
  const mode = useRef<Mode>("drift");
  const version = useRef(-1);
  const stop = useRef(0);
  const dwellUntil = useRef(0);
  const settleUntil = useRef(0);
  const focused = useRef<ShipTarget | null>(null);
  const lastScrollY = useRef(0);
  const scrollQuietAt = useRef(0);
  // Asteroid hunt (drift-mode easter egg).
  const asteroid = useRef<Asteroid | null>(null);
  const nextAsteroidAt = useRef(0);
  const boomUntil = useRef(0);
  const boomAt = useRef({ x: 0, y: 0 });
  const seed = useRef(1);

  useEffect(() => {
    setEnabled(window.matchMedia("(min-width: 1024px) and (hover: hover)").matches);
  }, []);

  // Deterministic-enough pseudo-random for spawn variety.
  const rand = () => {
    seed.current = (seed.current * 16807) % 2147483647;
    return seed.current / 2147483647;
  };

  useAnimationFrame((time, delta) => {
    if (!enabled) return;
    const registry = ship.read();

    // "Settled" means the page hasn't moved for a beat.
    const scrollYNow = window.scrollY;
    if (Math.abs(scrollYNow - lastScrollY.current) > 2) {
      scrollQuietAt.current = time + SCROLL_QUIET_MS;
    }
    lastScrollY.current = scrollYNow;
    const scrolling = time < scrollQuietAt.current;

    // Any registry change cancels the current tour — cleanly.
    if (registry.version !== version.current) {
      version.current = registry.version;
      focused.current?.blur?.();
      focused.current = null;
      stop.current = 0;
      if (registry.targets.length > 0 && !registry.userBusy) {
        mode.current = "settle";
        settleUntil.current = time + SETTLE_MS;
      } else {
        mode.current = "drift";
        nextAsteroidAt.current =
          time + ASTEROID_MIN_MS + rand() * (ASTEROID_MAX_MS - ASTEROID_MIN_MS);
      }
    }

    if (mode.current === "settle" && time >= settleUntil.current && !scrolling) {
      mode.current = "tour";
    }

    if (mode.current === "tour" || mode.current === "parked") {
      const target = registry.targets[stop.current];
      if (!target) {
        mode.current = "drift";
      } else if (!scrolling) {
        // Only follow the page when the reader is settled — while scrolling
        // the ship holds its screen position and lets the content flow past.
        const rect = target.getRect();
        if (!rect) {
          stop.current++;
          return;
        }
        const tx = rect.left - 30;
        const ty = rect.top + rect.height / 2;
        x.set(tx);
        y.set(ty);

        if (mode.current === "tour") {
          const arrived = Math.hypot(tx - x.get(), ty - y.get()) < ARRIVAL_PX;
          if (arrived && focused.current !== target) {
            focused.current?.blur?.();
            focused.current = target;
            target.focus?.();
            dwellUntil.current = time + DWELL_MS;
            if (target.park) mode.current = "parked";
          } else if (arrived && time >= dwellUntil.current) {
            stop.current++;
          }
        }
      } else {
        // Keep the tour clock generous while scrolling so it resumes calmly.
        dwellUntil.current = Math.max(dwellUntil.current, time + 400);
      }
    }

    let driftHeading: number | null = null;
    let hunting = false;

    if (mode.current === "drift") {
      const rock = asteroid.current;

      if (rock) {
        // Advance the asteroid; the ship gives chase.
        rock.x += (rock.vx * delta) / 1000;
        rock.y += (rock.vy * delta) / 1000;
        rock.spin += delta * 0.06;
        if (asteroidEl.current) {
          asteroidEl.current.style.opacity = "1";
          asteroidEl.current.style.transform = `translate(${rock.x}px, ${rock.y}px) rotate(${rock.spin}deg)`;
        }
        hunting = true;
        x.set(rock.x - 34);
        y.set(rock.y);

        const close = Math.hypot(rock.x - 34 - x.get(), rock.y - y.get()) < 26;
        const escaped =
          rock.x < -40 || rock.x > window.innerWidth + 40 ||
          rock.y < -40 || rock.y > window.innerHeight + 40;

        if (close || escaped) {
          if (close && laser.current && asteroidEl.current) {
            // One flash of laser, then the rock pops into fragments.
            const el = laser.current;
            el.style.left = `${x.get()}px`;
            el.style.top = `${y.get()}px`;
            el.style.width = "30px";
            el.style.opacity = "1";
            setTimeout(() => {
              el.style.opacity = "0";
            }, 110);
            boomAt.current = { x: rock.x, y: rock.y };
            boomUntil.current = time + 550;
          }
          if (asteroidEl.current) asteroidEl.current.style.opacity = "0";
          asteroid.current = null;
          nextAsteroidAt.current =
            time + ASTEROID_MIN_MS + rand() * (ASTEROID_MAX_MS - ASTEROID_MIN_MS);
        }
      } else {
        // Lazy patrol; heading from the path derivative (continuous by
        // construction — the nose can never snap at a turnaround).
        const cx = window.innerWidth * 0.82;
        const cy = window.innerHeight * 0.72;
        x.set(cx + Math.sin(time * 0.00042) * 90);
        y.set(cy + Math.sin(time * 0.00061 + 1.4) * 55);
        const dx = Math.cos(time * 0.00042) * 90 * 0.00042;
        const dy = Math.cos(time * 0.00061 + 1.4) * 55 * 0.00061;
        driftHeading = (Math.atan2(dy, dx) * 180) / Math.PI;

        if (time >= nextAsteroidAt.current && nextAsteroidAt.current > 0) {
          // A rock wanders in from the right edge of the patrol quarter.
          asteroid.current = {
            x: window.innerWidth + 20,
            y: window.innerHeight * (0.45 + rand() * 0.4),
            vx: -(26 + rand() * 22),
            vy: (rand() - 0.5) * 18,
            spin: rand() * 360,
          };
        }
      }
    } else if (asteroidEl.current) {
      // Duty calls — any live rock escapes unharmed.
      asteroid.current = null;
      asteroidEl.current.style.opacity = "0";
    }

    // Fragments of the last popped asteroid scatter and fade.
    const boomLeft = boomUntil.current - time;
    fragmentEls.current.forEach((el, i) => {
      if (!el) return;
      if (boomLeft > 0) {
        const k = 1 - boomLeft / 550;
        const angle = (i / fragmentEls.current.length) * Math.PI * 2 + 0.6;
        el.style.opacity = String(0.85 * (1 - k));
        el.style.transform = `translate(${boomAt.current.x + Math.cos(angle) * 34 * k}px, ${
          boomAt.current.y + Math.sin(angle) * 34 * k
        }px) rotate(${k * 200}deg)`;
      } else {
        el.style.opacity = "0";
      }
    });

    // Heading rules: analytic while patrolling, velocity only during real
    // flight, frozen while the reader scrolls, easing level when perched.
    const vx = x.getVelocity();
    const vy = y.getVelocity();
    const speed = Math.hypot(vx, vy);
    let heading: number | null = null;
    if (driftHeading !== null) {
      heading = driftHeading;
    } else if (hunting || (!scrolling && speed > 200)) {
      heading = (Math.atan2(vy, vx) * 180) / Math.PI;
    } else if (!scrolling && (mode.current === "tour" || mode.current === "parked")) {
      heading = 0;
    }
    if (heading !== null) {
      const current = ((rotate.get() % 360) + 540) % 360 - 180;
      const d = ((heading - current + 540) % 360) - 180;
      rotate.set(current + d * 0.08);
    }

    if (flame.current) {
      flame.current.style.opacity = String(Math.min(0.9, speed / 900));
    }
  });

  if (reducedMotion || !enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[55]"
        style={{ x, y, rotate }}
      >
        <span className="relative block -translate-x-1/2 -translate-y-1/2">
          <span className="ship-bob relative block">
            {/* Thruster — brightens with speed. */}
            <span
              ref={flame}
              className="absolute right-full top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-l from-accent to-transparent opacity-0"
            />
            {/* Hull. */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M20 11 L3 4.5 L7.5 11 L3 17.5 Z"
                className="fill-accent/90 stroke-accent"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="11" r="1.2" className="fill-bg" />
            </svg>
            {/* Soft glow. */}
            <span className="absolute inset-0 -z-10 rounded-full bg-accent/25 blur-md" />
          </span>
        </span>
      </motion.div>

      {/* Asteroid-hunt props: one rock, one laser, a few fragments. */}
      <span aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[54]">
        <span ref={asteroidEl} className="ship-asteroid" />
        <span ref={laser} className="ship-laser" />
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              fragmentEls.current[i] = el;
            }}
            className="ship-fragment"
          />
        ))}
      </span>
    </>
  );
}
