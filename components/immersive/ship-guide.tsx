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
/** Time between asteroid events (a single rock, or sometimes a shower). */
const SPAWN_MIN_MS = 5000;
const SPAWN_MAX_MS = 11000;
/** Chance an asteroid event is a whole shower. */
const SHOWER_CHANCE = 0.28;
/** The ship takes a beat to aim, and a beat to admire its work. */
const AIM_MS = 420;
const ADMIRE_MS = 450;
/** Debris drifts off in its own directions and fades over a few seconds. */
const FRAG_LIFE_MIN_MS = 2200;
const FRAG_LIFE_MAX_MS = 3400;
/** Free-roaming cruise: slow, constant, unhurried. Duty transit stays brisk. */
const WANDER_SPEED = 75; // px/s
const WAYPOINT_MIN_MS = 6000;
const WAYPOINT_MAX_MS = 12000;

const MAX_ROCKS = 8;
const MAX_FRAGS = 24;

type Mode = "free" | "transit" | "present";

interface Rock {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  scale: number;
}

interface Fragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  spinV: number;
  bornAt: number;
  life: number;
}

/**
 * The ship guide, final form. Its life:
 * - FREE: lazy patrol. Rocks drift in — singles, sometimes whole showers —
 *   and it hunts the nearest one it can see: stalks it nose-first, holds its
 *   aim, fires, watches the debris a beat, then takes the next.
 * - DUTY: when the reader settles on something new, it flies over, presents
 *   ~2s (halo lights on arrival), and returns to its life. Shown once.
 * - Scrolling always frees it; rocks it ignores drift through unharmed.
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
  const rockEls = useRef<Array<HTMLSpanElement | null>>([]);
  const fragEls = useRef<Array<HTMLSpanElement | null>>([]);

  // Flight state lives in refs — the loop runs at 60fps without re-renders.
  const mode = useRef<Mode>("free");
  const version = useRef(-1);
  const shownVersion = useRef(-1);
  const stop = useRef(0);
  const presentUntil = useRef(0);
  const focused = useRef<ShipTarget | null>(null);
  const lastScrollY = useRef(0);
  const scrollQuietAt = useRef(0);
  // Space weather.
  const rocks = useRef<Rock[]>([]);
  const frags = useRef<Fragment[]>([]);
  const nextSpawnAt = useRef(0);
  const showerLeft = useRef(0);
  const nextShowerDropAt = useRef(0);
  const aimUntil = useRef(0);
  const admireUntil = useRef(0);
  // Free-roaming cruise state: a virtual position gliding between waypoints
  // anywhere on screen. Re-seeded from wherever the ship currently is, so
  // returning to its life never snaps it anywhere.
  const cruise = useRef<{ x: number; y: number } | null>(null);
  const waypoint = useRef({ x: 0, y: 0 });
  const waypointUntil = useRef(0);
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

  const spawnRock = (shower: boolean) => {
    if (rocks.current.length >= MAX_ROCKS) return;
    rocks.current.push({
      x: window.innerWidth + 24,
      y: window.innerHeight * (shower ? 0.1 + rand() * 0.5 : 0.25 + rand() * 0.55),
      // Showers rain through faster and more diagonally.
      vx: shower ? -(28 + rand() * 16) : -(15 + rand() * 10),
      vy: shower ? 10 + rand() * 14 : (rand() - 0.5) * 12,
      spin: rand() * 360,
      scale: 0.7 + rand() * 0.6,
    });
  };

  const explode = (rock: Rock, time: number) => {
    const count = 5 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      if (frags.current.length >= MAX_FRAGS) break;
      const angle = rand() * Math.PI * 2;
      const speed = 14 + rand() * 34;
      frags.current.push({
        x: rock.x,
        y: rock.y,
        vx: Math.cos(angle) * speed + rock.vx * 0.3,
        vy: Math.sin(angle) * speed + rock.vy * 0.3,
        spin: rand() * 360,
        spinV: (rand() - 0.5) * 240,
        bornAt: time,
        life: FRAG_LIFE_MIN_MS + rand() * (FRAG_LIFE_MAX_MS - FRAG_LIFE_MIN_MS),
      });
    }
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

    /* --- Space weather: rocks fall whatever the ship is doing. --- */
    if (nextSpawnAt.current === 0) {
      nextSpawnAt.current =
        time + SPAWN_MIN_MS + rand() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
    }
    if (time >= nextSpawnAt.current) {
      if (rand() < SHOWER_CHANCE) {
        showerLeft.current = 4 + Math.floor(rand() * 4);
        nextShowerDropAt.current = time;
      } else {
        spawnRock(false);
      }
      nextSpawnAt.current =
        time + SPAWN_MIN_MS + rand() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
    }
    if (showerLeft.current > 0 && time >= nextShowerDropAt.current) {
      spawnRock(true);
      showerLeft.current--;
      nextShowerDropAt.current = time + 260 + rand() * 420;
    }

    // Advance every rock; drop the escaped.
    rocks.current = rocks.current.filter((rock) => {
      rock.x += (rock.vx * delta) / 1000;
      rock.y += (rock.vy * delta) / 1000;
      rock.spin += delta * 0.045;
      return (
        rock.x > -40 && rock.x < window.innerWidth + 60 &&
        rock.y > -40 && rock.y < window.innerHeight + 60
      );
    });

    // The ship only notices rocks well inside the viewport — the hunt must
    // happen where the visitor can watch it.
    const noticeable = rocks.current.filter(
      (rock) =>
        rock.x < window.innerWidth - 140 && rock.x > 80 &&
        rock.y > 60 && rock.y < window.innerHeight - 60,
    );

    let prey: Rock | null = null;
    const admiring = time < admireUntil.current;

    if (mode.current === "free" && !scrolling && !admiring && noticeable.length > 0) {
      // Nearest first — a shower becomes a chain of kills.
      prey = noticeable.reduce((a, b) =>
        Math.hypot(a.x - x.get(), a.y - y.get()) <
        Math.hypot(b.x - x.get(), b.y - y.get())
          ? a
          : b,
      );
      x.set(prey.x - 36);
      y.set(prey.y);
      const inRange = Math.hypot(prey.x - 36 - x.get(), prey.y - y.get()) < 30;

      if (inRange && aimUntil.current === 0) {
        aimUntil.current = time + AIM_MS; // hold... aim...
      } else if (!inRange) {
        aimUntil.current = 0;
      } else if (time >= aimUntil.current) {
        // Fire — laser from the nose to the rock, then admire the debris.
        if (laser.current) {
          const el = laser.current;
          const dx = prey.x - x.get();
          const dy = prey.y - y.get();
          el.style.left = `${x.get() + 8}px`;
          el.style.top = `${y.get()}px`;
          el.style.width = `${Math.max(16, Math.hypot(dx, dy) - 10)}px`;
          el.style.transform = `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`;
          el.style.opacity = "1";
          setTimeout(() => {
            el.style.opacity = "0";
          }, 150);
        }
        explode(prey, time);
        rocks.current = rocks.current.filter((rock) => rock !== prey);
        aimUntil.current = 0;
        admireUntil.current = time + ADMIRE_MS;
        prey = null;
      }
    } else if (mode.current !== "free" || scrolling) {
      aimUntil.current = 0;
    }

    if (mode.current === "free" && !prey && !admiring) {
      // Free roaming: pick a waypoint anywhere on screen and cruise there at
      // a constant, unhurried pace — then pick another. It starts from
      // wherever it happens to be, so nothing ever snaps.
      if (!cruise.current) {
        cruise.current = { x: x.get(), y: y.get() };
        waypointUntil.current = 0;
      }
      const here = cruise.current;
      const reached =
        Math.hypot(waypoint.current.x - here.x, waypoint.current.y - here.y) < 28;
      if (reached || time >= waypointUntil.current) {
        waypoint.current = {
          x: window.innerWidth * (0.08 + rand() * 0.84),
          y: window.innerHeight * (0.12 + rand() * 0.76),
        };
        waypointUntil.current =
          time + WAYPOINT_MIN_MS + rand() * (WAYPOINT_MAX_MS - WAYPOINT_MIN_MS);
      }
      const dx = waypoint.current.x - here.x;
      const dy = waypoint.current.y - here.y;
      const dist = Math.hypot(dx, dy) || 1;
      const step = Math.min(dist, (WANDER_SPEED * delta) / 1000);
      here.x += (dx / dist) * step;
      here.y += (dy / dist) * step;
      // A light sway on top of the cruise keeps it alive.
      x.set(here.x + Math.sin(time * 0.0006) * 10);
      y.set(here.y + Math.sin(time * 0.00084 + 2) * 8);
    } else {
      // Duty, hunt or admiration: the next free moment re-seeds the cruise.
      cruise.current = null;
    }

    // Render rocks and debris through their pools.
    rockEls.current.forEach((el, i) => {
      if (!el) return;
      const rock = rocks.current[i];
      if (rock) {
        el.style.opacity = "0.9";
        el.style.transform = `translate(${rock.x}px, ${rock.y}px) rotate(${rock.spin}deg) scale(${rock.scale})`;
      } else {
        el.style.opacity = "0";
      }
    });

    frags.current = frags.current.filter((frag) => time - frag.bornAt < frag.life);
    fragEls.current.forEach((el, i) => {
      if (!el) return;
      const frag = frags.current[i];
      if (frag) {
        const k = (time - frag.bornAt) / frag.life;
        frag.x += (frag.vx * delta) / 1000;
        frag.y += (frag.vy * delta) / 1000;
        frag.vx *= 0.998;
        frag.vy *= 0.998;
        frag.spin += (frag.spinV * delta) / 1000;
        el.style.opacity = String(0.9 * (1 - k * k));
        el.style.transform = `translate(${frag.x}px, ${frag.y}px) rotate(${frag.spin}deg) scale(${1 - k * 0.4})`;
      } else {
        el.style.opacity = "0";
      }
    });

    // Heading: locked on the prey while hunting (a hunter faces its prey),
    // analytic on patrol, velocity in real flight, level when presenting,
    // frozen while the reader scrolls.
    const vx = x.getVelocity();
    const vy = y.getVelocity();
    const speed = Math.hypot(vx, vy);
    let heading: number | null = null;
    let turnRate = 0.1;
    if (prey) {
      heading =
        (Math.atan2(prey.y - y.get(), prey.x - x.get()) * 180) / Math.PI;
    } else if (mode.current === "free" && !admiring && cruise.current) {
      // Nose toward the waypoint it's cruising to — lazy turns.
      heading =
        (Math.atan2(
          waypoint.current.y - cruise.current.y,
          waypoint.current.x - cruise.current.x,
        ) *
          180) /
        Math.PI;
      turnRate = 0.05;
    } else if (!scrolling && speed > 200) {
      heading = (Math.atan2(vy, vx) * 180) / Math.PI;
    } else if (!scrolling && mode.current === "present") {
      heading = 0;
    }
    if (heading !== null) {
      const current = ((rotate.get() % 360) + 540) % 360 - 180;
      const d = ((heading - current + 540) % 360) - 180;
      rotate.set(current + d * turnRate);
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

      {/* Space weather props: a pool of rocks, one laser, a debris pool. */}
      <span aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[54]">
        {Array.from({ length: MAX_ROCKS }, (_, i) => (
          <span
            key={`rock-${i}`}
            ref={(el) => {
              rockEls.current[i] = el;
            }}
            className="ship-asteroid"
          />
        ))}
        <span ref={laser} className="ship-laser" />
        {Array.from({ length: MAX_FRAGS }, (_, i) => (
          <span
            key={`frag-${i}`}
            ref={(el) => {
              fragEls.current[i] = el;
            }}
            className="ship-fragment"
          />
        ))}
      </span>
    </>
  );
}
