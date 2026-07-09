import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * First-visit locale resolution, in priority order:
 *   1. the persisted `NEXT_LOCALE` cookie (set by the language toggle),
 *   2. the browser's `Accept-Language`,
 *   3. the default locale.
 * The cookie is the source of truth because it is the only signal middleware
 * (Edge runtime) can read — localStorage is not available here.
 */
function resolveLocale(request: NextRequest): string {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
    .find((lang) => isLocale(lang));

  return preferred ?? DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  // Unprefixed path (e.g. bare "/") → redirect to a resolved, prefixed URL.
  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // Skip Next internals, the API, and any file with an extension (assets, and
  // metadata routes like sitemap.xml / opengraph-image). Everything else is a
  // page that must carry a locale prefix.
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
