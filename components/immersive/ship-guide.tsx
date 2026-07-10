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

type Mode = "drift" | "settle" | "tour" | "parked";

/**
 * The ship guide: a small autonomous drone that tours whatever targets are
 * published (hotspots in order, then the parking spot by the CTA), opening
 * each point's detail as it arrives. With no targets — or when the visitor
 * explores by hand — it falls back to a lazy background patrol. Version
 * checks against the registry make fast scrolling safe: any change cancels
 * the current tour before the next frame.
 *
 * Desktop-only and skipped entirely under reduced motion.
 */
export function ShipGuide() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  // Springs give the flight its banking, overshooting character.
  const x = useSpring(useMotionValue(-60), { stiffness: 46, damping: 13 });
  const y = useSpring(useMotionValue(-60), { stiffness: 46, damping: 13 });
  const rotate = useMotionValue(0);

  const shipRef = useRef<HTMLDivElement>(null);
  const flame = useRef<HTMLSpanElement>(null);
  const beam = useRef<HTMLSpanElement>(null);

  // Flight state lives in refs — the loop runs at 60fps without re-renders.
  const mode = useRef<Mode>("drift");
  const version = useRef(-1);
  const stop = useRef(0); // current tour stop index
  const dwellUntil = useRef(0);
  const settleUntil = useRef(0);
  const focused = useRef<ShipTarget | null>(null);

  useEffect(() => {
    // The ship needs a pointer-driven desktop; touch layouts have chips instead.
    setEnabled(window.matchMedia("(min-width: 1024px) and (hover: hover)").matches);
  }, []);

  useAnimationFrame((time) => {
    if (!enabled) return;
    const registry = ship.read();

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
      }
    }

    if (mode.current === "settle" && time >= settleUntil.current) {
      mode.current = "tour";
    }

    if (mode.current === "tour" || mode.current === "parked") {
      const target = registry.targets[stop.current];
      if (!target) {
        mode.current = "drift";
      } else {
        const rect = target.getRect();
        if (!rect) {
          // Target unmounted mid-flight — skip it.
          stop.current++;
          return;
        }
        // Hover just left of the point, vertically centred.
        const tx = rect.left - 30;
        const ty = rect.top + rect.height / 2;
        x.set(tx);
        y.set(ty);

        if (mode.current === "tour") {
          const dx = tx - x.get();
          const dy = ty - y.get();
          const arrived = Math.hypot(dx, dy) < ARRIVAL_PX;

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
      }
    }

    let driftHeading: number | null = null;
    if (mode.current === "drift") {
      // Lazy patrol in the lower-right quarter of the viewport. The heading
      // comes from the path's derivative — continuous by construction, so the
      // nose can never snap at a turnaround.
      const cx = window.innerWidth * 0.82;
      const cy = window.innerHeight * 0.72;
      x.set(cx + Math.sin(time * 0.00042) * 90);
      y.set(cy + Math.sin(time * 0.00061 + 1.4) * 55);
      const dx = Math.cos(time * 0.00042) * 90 * 0.00042;
      const dy = Math.cos(time * 0.00061 + 1.4) * 55 * 0.00061;
      driftHeading = (Math.atan2(dy, dx) * 180) / Math.PI;
    }

    // Heading: follow the flight direction — around the SHORT way (a naive
    // lerp across the ±180° seam spins the ship into a fit) — face the point
    // while studying, and hold steady through slow drift turnarounds instead
    // of twitching between "follow" and "reset".
    const vx = x.getVelocity();
    const vy = y.getVelocity();
    const speed = Math.hypot(vx, vy);
    let heading: number | null = null;
    if (driftHeading !== null) {
      heading = driftHeading;
    } else if (speed > 30) {
      heading = (Math.atan2(vy, vx) * 180) / Math.PI;
    } else if (mode.current === "tour" || mode.current === "parked") {
      heading = 0; // nose toward the point it studies
    }
    if (heading !== null) {
      const current = ((rotate.get() % 360) + 540) % 360 - 180;
      const delta = ((heading - current + 540) % 360) - 180;
      rotate.set(current + delta * 0.08);
    }
    if (flame.current) {
      flame.current.style.opacity = String(Math.min(0.9, speed / 900));
    }
    // Scan beam: on while studying a point (slow and on-station), off in flight.
    if (beam.current) {
      const studying =
        (mode.current === "tour" || mode.current === "parked") &&
        focused.current !== null &&
        speed < 80;
      beam.current.style.opacity = studying ? "1" : "0";
    }
  });

  if (reducedMotion || !enabled) return null;

  return (
    <motion.div
      ref={shipRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[55]"
      style={{ x, y, rotate }}
    >
      <span className="relative block -translate-x-1/2 -translate-y-1/2">
        {/* Idle bob keeps it alive even when parked. */}
        <span className="ship-bob relative block">
          {/* Thruster — brightens with speed. */}
          <span
            ref={flame}
            className="absolute right-full top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-l from-accent to-transparent opacity-0"
          />
          {/* Scan beam — dashed pulse toward the point being studied. */}
          <span
            ref={beam}
            className="ship-beam absolute left-full top-1/2 h-px w-6 -translate-y-1/2 opacity-0"
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
  );
}
