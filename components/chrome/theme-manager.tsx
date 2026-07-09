"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// useLayoutEffect on the client (runs before paint → no flash), useEffect on
// the server render pass (avoids React's SSR warning). ThemeManager renders
// nothing, so this only controls when the sync runs.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Keeps the theme class in sync across client navigations.
 *
 * The boot script sets the theme before first paint, but a locale change
 * re-renders the layout's <html>, which can drop the imperatively-added `.dark`
 * class. This re-applies the stored (or system) theme on every pathname change,
 * before the browser paints — so switching language never flips the theme.
 */
export function ThemeManager() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    try {
      const stored = localStorage.getItem("theme");
      const dark = stored
        ? stored === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", dark);
    } catch {
      // localStorage/matchMedia unavailable — keep whatever the boot script set.
    }
  }, [pathname]);

  return null;
}
