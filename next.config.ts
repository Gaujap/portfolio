import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/*
 * Content-Security-Policy. This is a statically-generated site, so Next streams
 * inline bootstrap scripts and we ship an inline theme-boot script — neither can
 * carry a nonce without going fully dynamic, so script/style use 'unsafe-inline'.
 * The value that remains is real: no external origin can load scripts, styles,
 * frames or fonts. WebGL runs from 'self'; Vercel Analytics / Speed Insights
 * post to same-origin (/_vercel/*) with the vitals host allowed for older paths.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow .mdx alongside .ts/.tsx so project write-ups compile at build time.
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
