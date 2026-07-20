/**
 * i18n primitives — no library, by design. The site is small and a dependency
 * here would be a long-term liability. This module is pure (no React, no
 * server-only APIs) so it can be imported from middleware, server components,
 * and client components alike.
 */

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

/** Primary audience is North American, so English is the default. */
export const DEFAULT_LOCALE: Locale = "en";

/** Runtime guard that also narrows `string` to `Locale`. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** A value expressed in every supported locale. The core content primitive. */
export type Localized<T = string> = { en: T; fr: T };

/**
 * Resolve a localized value. Kept as a plain function (not a hook) so server
 * components can call it without opting into client rendering. Client islands
 * read the current locale from `useLocale()` and pass it in.
 */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
