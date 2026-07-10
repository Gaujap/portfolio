"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { ship } from "@/lib/ship";

/**
 * The ship as reading companion on a project page: whichever section heading
 * crosses the middle of the viewport becomes its perch — it flies there and
 * holds while you read, section after section. When the end-of-page nav
 * arrives, it parks beside "next project", offering the continuation.
 * Live rects + the registry's version token keep fast scrolling safe.
 */
export function WorkGuide() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("main h2"),
    );
    const nextLink = document.getElementById("work-next");
    if (headings.length === 0) return;

    // The perched element carries a halo — light is the connection.
    let lit: HTMLElement | null = null;
    const light = (element: HTMLElement | null) => {
      if (lit === element) return;
      lit?.classList.remove("guide-lit");
      element?.classList.add("guide-lit");
      lit = element;
    };

    const perch = (element: HTMLElement, id: string) => {
      light(element);
      ship.publish(
        "work",
        [
          {
            id,
            order: 0,
            park: true,
            getRect: () => element.getBoundingClientRect(),
          },
        ],
        15,
      );
    };

    const choosePerch = () => {
      // The end-of-page nav takes priority the moment it's meaningfully visible.
      if (nextLink) {
        const rect = nextLink.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          perch(nextLink, "work-next");
          return;
        }
      }
      // Otherwise: the heading closest above the viewport's middle.
      const middle = window.innerHeight * 0.5;
      let current: HTMLElement | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= middle) current = heading;
      }
      if (current) {
        perch(current, `work-${current.textContent ?? ""}`);
      } else {
        light(null);
        ship.retract("work");
      }
    };

    // Headings report when they cross the viewport's centre band; the nav
    // needs its own full-viewport observer — at page bottom it never reaches
    // the centre band, so no heading event would ever fire for it.
    const headingObserver = new IntersectionObserver(choosePerch, {
      rootMargin: "-45% 0px -45% 0px",
      threshold: [0, 1],
    });
    headings.forEach((heading) => headingObserver.observe(heading));

    const navObserver = nextLink
      ? new IntersectionObserver(choosePerch, { threshold: [0, 0.5, 1] })
      : null;
    if (nextLink) navObserver?.observe(nextLink);

    return () => {
      headingObserver.disconnect();
      navObserver?.disconnect();
      light(null);
      ship.retract("work");
    };
  }, [reducedMotion]);

  return null;
}
