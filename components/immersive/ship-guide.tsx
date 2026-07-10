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

/** How long the ship presents a point before returning to its life. */
const PRESENT_MS = 2000;
/** Parking spots (CTAs) get a little longer. */
const PARK_MS = 3200;
/** How long after the last scroll movement the reader counts as settled. */
const SCROLL_QUIET_MS = 280;
/** Close enough to a target to count as arrived. */
const ARRIVAL_PX = 12;
/** Idle time between asteroid visits. */
const ASTEROID_MIN_MS = 7000;
const ASTEROID_MAX_MS = 15000;
/** The ship takes a beat to aim before firing — so you can watch it work. */
const AIM_MS = 380;
const BOOM_MS = 900;

type Mode = "free" | "transit" | "present";

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
}

/**
 * The ship guide, third edition. Its life:
 * - By default it's FREE: lazy patrol, and when an asteroid drifts by, it
 *   stalks it, takes aim, and fires — slowly enough to watch.
 * - When the reader settles and there's something new to show, duty calls:
 *   it flies over (transit), presents the point ~2s (halo lights via the
 *   target's focus callback), moves to the next, and when the tour is done it
 *   returns to its life. Each published tour is shown once.
 * - Scrolling never makes it chase anything: any scroll aborts the tour and
 *   frees it; settling re-runs whatever wasn't fully shown.
 * - Asteroids drift through regardless, but it only hunts when free.
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
  const mode = useRef<Mode>("free");
  const version = useRef(-1);
  const shownVersion = useRef(-1);
  const stop = useRef(0);
  const presentUntil = useRef(0);
  const focused = useRef<ShipTarget | null>(null);
  const lastScrollY = useRef(0);
  const scrollQuietAt = useRef(0);
  // The asteroid lives independently of duty.
  const asteroid = useRef<Asteroid | null>(null);
  const nextAsteroidAt = useRef(0);
  const aimUntil = useRef(0);
  const boomUntil = useRef(0);
  const boomAt = useRef({ x: 0, y: 0 });
  const seed = useRef(1);

  useEffect(() => {
    setEnabled(window.matchMedia("(min-width: 1024px) and (hover: hover)").matches);
  }, []);

  const rand = () => {
    seed.current = (seed.current * 16807) % 2147483647;
    return seed.current / 2147483647;
  };

  const release = () => {
    focused.current?.blur?.();
    focused.current = null;
    mode.current = "free";
  };

  useAnimationFrame((time, delta) => {
    if (!enabled) return;
    const registry = ship.read();

    // Settled = the page hasn't meaningfully moved for a beat.
    const scrollYNow = window.scrollY;
    if (Math.abs(scrollYNow - lastScrollY.current) > 4) {
      scrollQuietAt.current = time + SCROLL_QUIET_MS;
    }
    lastScrollY.current = scrollYNow;
    const scrolling = time < scrollQuietAt.current;

    // New targets invalidate whatever was being shown.
    if (registry.version !== version.current) {
      version.current = registry.version;
      stop.current = 0;
      release();
    }

    // Scrolling frees the ship instantly — it lives its life while you move.
    if (scrolling && mode.current !== "free") {
      stop.current = 0;
      release();
    }

    // Duty: something new to show, and the reader is settled.
    const hasDuty =
      registry.targets.length > 0 &&
      !registry.userBusy &&
      shownVersion.current !== registry.version;

    if (!scrolling && hasDuty && mode.current === "free") {
      mode.current = "transit";
    }

    if (mode.current === "transit" || mode.current === "present") {
      const target = registry.targets[stop.current];
      if (!target) {
        shownVersion.current = registry.version;
        release();
      } else {
        const rect = target.getRect();
        if (!rect) {
          stop.current++;
        } else {
          const tx = rect.left - 30;
          const ty = rect.top + rect.height / 2;
          x.set(tx);
          y.set(ty);

          if (mode.current === "transit") {
            const arrived = Math.hypot(tx - x.get(), ty - y.get()) < ARRIVAL_PX;
            if (arrived) {
              focused.current = target;
              target.focus?.();
              presentUntil.current = time + (target.park ? PARK_MS : PRESENT_MS);
              mode.current = "present";
            }
          } else if (time >= presentUntil.current) {
            // Shown long enough — on to the next point, or back to its life.
            focused.current?.blur?.();
            focused.current = null;
            stop.current++;
            if (stop.current >= registry.targets.length) {
              shownVersion.current = registry.version;
              mode.current = "free";
            } else {
              mode.current = "transit";
            }
          }
        }
      }
    }

    /* --- The asteroid lives its own life, whatever the ship is doing. --- */
    if (nextAsteroidAt.current === 0) {
      nextAsteroidAt.current =
        time + ASTEROID_MIN_MS + rand() * (ASTEROID_MAX_MS - ASTEROID_MIN_MS);
    }
    if (!asteroid.current && time >= nextAsteroidAt.current) {
      asteroid.current = {
        x: window.innerWidth + 24,
        y: window.innerHeight * (0.3 + rand() * 0.5),
        vx: -(15 + rand() * 10), // slow enough to watch
        vy: (rand() - 0.5) * 12,
        spin: rand() * 360,
      };
    }

    const rock = asteroid.current;
    let hunting = false;

    if (rock) {
      rock.x += (rock.vx * delta) / 1000;
      rock.y += (rock.vy * delta) / 1000;
      rock.spin += delta * 0.045;
      if (asteroidEl.current) {
        asteroidEl.current.style.opacity = "0.9";
        asteroidEl.current.style.transform = `translate(${rock.x}px, ${rock.y}px) rotate(${rock.spin}deg)`;
      }

      const escaped =
        rock.x < -40 || rock.x > window.innerWidth + 60 ||
        rock.y < -40 || rock.y > window.innerHeight + 40;

      if (escaped) {
        // Got away — if the ship was busy presenting, it never even tried.
        if (asteroidEl.current) asteroidEl.current.style.opacity = "0";
        asteroid.current = null;
        aimUntil.current = 0;
        nextAsteroidAt.current =
          time + ASTEROID_MIN_MS + rand() * (ASTEROID_MAX_MS - ASTEROID_MIN_MS);
      } else if (mode.current === "free" && !scrolling) {
        // Free and settled: the hunt is on — stalk, aim, fire.
        hunting = true;
        x.set(rock.x - 36);
        y.set(rock.y);
        const inRange = Math.hypot(rock.x - 36 - x.get(), rock.y - y.get()) < 30;

        if (inRange && aimUntil.current === 0) {
          aimUntil.current = time + AIM_MS; // hold... aim...
        } else if (!inRange) {
          aimUntil.current = 0;
        } else if (time >= aimUntil.current) {
          // Fire.
          if (laser.current) {
            const el = laser.current;
            el.style.left = `${x.get() + 10}px`;
            el.style.top = `${y.get()}px`;
            el.style.width = `${Math.max(18, rock.x - x.get() - 12)}px`;
            el.style.opacity = "1";
            setTimeout(() => {
              el.style.opacity = "0";
            }, 150);
          }
          boomAt.current = { x: rock.x, y: rock.y };
          boomUntil.current = time + BOOM_MS;
          if (asteroidEl.current) asteroidEl.current.style.opacity = "0";
          asteroid.current = null;
          aimUntil.current = 0;
          nextAsteroidAt.current =
            time + ASTEROID_MIN_MS + rand() * (ASTEROID_MAX_MS - ASTEROID_MIN_MS);
        }
      } else {
        aimUntil.current = 0;
      }
    }

    if (mode.current === "free" && !hunting) {
      // Lazy patrol; heading from the path derivative (continuous by
      // construction — the nose can never snap at a turnaround).
      const cx = window.innerWidth * 0.82;
      const cy = window.innerHeight * 0.72;
      x.set(cx + Math.sin(time * 0.00042) * 90);
      y.set(cy + Math.sin(time * 0.00061 + 1.4) * 55);
    }

    // Fragments of the last popped asteroid scatter and fade.
    const boomLeft = boomUntil.current - time;
    fragmentEls.current.forEach((el, i) => {
      if (!el) return;
      if (boomLeft > 0) {
        const k = 1 - boomLeft / BOOM_MS;
        const angle = (i / fragmentEls.current.length) * Math.PI * 2 + 0.6;
        el.style.opacity = String(0.9 * (1 - k * k));
        el.style.transform = `translate(${
          boomAt.current.x + Math.cos(angle) * 46 * k
        }px, ${boomAt.current.y + Math.sin(angle) * 46 * k}px) rotate(${k * 240}deg) scale(${1 - k * 0.5})`;
      } else {
        el.style.opacity = "0";
      }
    });

    // Heading: analytic while patrolling, velocity in real flight, level when
    // presenting, frozen while the reader scrolls.
    const vx = x.getVelocity();
    const vy = y.getVelocity();
    const speed = Math.hypot(vx, vy);
    let heading: number | null = null;
    if (mode.current === "free" && !hunting) {
      const dx = Math.cos(time * 0.00042) * 90 * 0.00042;
      const dy = Math.cos(time * 0.00061 + 1.4) * 55 * 0.00061;
      heading = (Math.atan2(dy, dx) * 180) / Math.PI;
    } else if (hunting || (!scrolling && speed > 200)) {
      heading = (Math.atan2(vy, vx) * 180) / Math.PI;
    } else if (!scrolling && mode.current === "present") {
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

      {/* Asteroid-hunt props: one rock, one laser, a handful of fragments. */}
      <span aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[54]">
        <span ref={asteroidEl} className="ship-asteroid" />
        <span ref={laser} className="ship-laser" />
        {Array.from({ length: 5 }, (_, i) => (
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
