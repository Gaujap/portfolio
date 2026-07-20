import { Newsreader, Geist, Geist_Mono } from "next/font/google";

/**
 * Three self-hosted families, exposed as CSS variables consumed by Tailwind's
 * `@theme` in `app/globals.css`. `next/font` downloads and self-hosts these at
 * build time (no runtime request to Google) and generates a metric-matched
 * fallback, so there is zero layout shift.
 *
 * The variable names here are deliberately family-specific (`--font-newsreader`,
 * not `--font-display`) to avoid a circular reference with the Tailwind tokens,
 * which are named by role (`--font-display`, `--font-sans`, `--font-mono`).
 */

// Display serif — hero thesis, headings, and pull-quotes (uses its italic).
export const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

// Body grotesque — everything else that isn't a heading or code.
export const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Monospace — code blocks and technical identifiers only.
export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Combined class list to apply the three font variables on `<html>`. */
export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
