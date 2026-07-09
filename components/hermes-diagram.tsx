"use client";

import { useEffect, useRef } from "react";

/**
 * Hermes voice pipeline as a themed inline SVG — the site's one signature
 * motion moment. On scroll into view, an accent line traces the flow
 * (openWakeWord → faster-whisper → LLM → Piper TTS) exactly once. With reduced
 * motion or no JS the trace is drawn statically, so the diagram is always fully
 * legible. Colours come from CSS tokens, so it themes with the site.
 */
const nodes = [
  { x: 12, main: "openWakeWord", sub: "wake word" },
  { x: 192, main: "faster-whisper", sub: "STT · FR" },
  { x: 372, main: "LLM", sub: "orchestrator" },
  { x: 552, main: "Piper TTS", sub: "speech" },
];

const NODE_W = 156;
const NODE_H = 52;
const NODE_Y = 92;
const MID_Y = NODE_Y + NODE_H / 2;

export function HermesDiagram({ label }: { label: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.setAttribute("data-animate", "true");
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="my-4">
      <svg
        ref={ref}
        className="hermes-diagram w-full"
        viewBox="0 0 720 210"
        role="img"
        aria-label={label}
        fill="none"
      >
        {/* Flow line (static, muted) then the animated accent trace on top. */}
        <line x1="12" y1={MID_Y} x2="708" y2={MID_Y} className="stroke-line" strokeWidth="1.5" />
        <line
          x1="12"
          y1={MID_Y}
          x2="708"
          y2={MID_Y}
          pathLength={1}
          className="hermes-trace stroke-accent"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* NFC trigger feeding the orchestrator. */}
        <line x1="450" y1="34" x2="450" y2={NODE_Y} className="stroke-line" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="450" y="24" textAnchor="middle" className="fill-muted font-mono" fontSize="10">
          NFC · /trigger
        </text>

        {nodes.map((node, i) => {
          const cx = node.x + NODE_W / 2;
          return (
            <g key={node.main}>
              {/* Arrowhead in the gap before this node (except the first). */}
              {i > 0 && (
                <path
                  d={`M ${node.x - 9} ${MID_Y - 4} L ${node.x - 1} ${MID_Y} L ${node.x - 9} ${MID_Y + 4}`}
                  className="stroke-accent"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Node body masks the flow line beneath it. */}
              <rect
                x={node.x}
                y={NODE_Y}
                width={NODE_W}
                height={NODE_H}
                rx="8"
                className="fill-bg stroke-line"
                strokeWidth="1.5"
              />
              <text x={cx} y={MID_Y - 2} textAnchor="middle" className="fill-fg font-mono" fontSize="13">
                {node.main}
              </text>
              <text x={cx} y={MID_Y + 14} textAnchor="middle" className="fill-muted font-mono" fontSize="10">
                {node.sub}
              </text>
            </g>
          );
        })}

        {/* Local / cloud backends under the orchestrator. */}
        <line x1="450" y1={NODE_Y + NODE_H} x2="450" y2="166" className="stroke-line" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="450" y="180" textAnchor="middle" className="fill-fg font-mono" fontSize="11">
          Qwen 2.5 14B · ROCm
        </text>
        <text x="450" y="196" textAnchor="middle" className="fill-muted font-mono" fontSize="10">
          Claude Haiku · fallback
        </text>
      </svg>
    </figure>
  );
}
