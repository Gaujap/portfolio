import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// The palette is hard-coded (OG images can't read CSS vars) to the dark theme —
// the site's default — so social cards match what visitors actually see.
const PAPER = "#17150F";
const INK = "#E9E3D6";
const MUTED = "#A79E90";
const RUST = "#D9694C";
const LINE = "#322E26";

/**
 * Editorial OG card: an uppercase accent label, a large statement, and a
 * footer with the name. Shared by the home and angle `opengraph-image` routes.
 */
export function renderOgImage({
  label,
  title,
  footer,
}: {
  label: string;
  title: string;
  footer: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: RUST,
          }}
        >
          {label}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            lineHeight: 1.15,
            color: INK,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 3, width: 72, background: RUST, marginBottom: 24 }} />
          <div style={{ display: "flex", fontSize: 30, color: MUTED, borderTop: `0px solid ${LINE}` }}>
            {footer}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
