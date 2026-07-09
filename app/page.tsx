/*
 * Temporary design-system preview. It exists so the typography and palette can
 * be eyeballed in the browser during scaffolding, and is replaced by the real
 * localized home route in the i18n step. Not part of the shipped site.
 */

const swatches = [
  { name: "bg", label: "Paper / dark grey", className: "bg-bg border border-line" },
  { name: "fg", label: "Ink / off-white", className: "bg-fg" },
  { name: "muted", label: "Muted", className: "bg-muted" },
  { name: "accent", label: "Vermillion / rust", className: "bg-accent" },
  { name: "line", label: "Hairline", className: "bg-line" },
];

export default function StylePreview() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Design system · preview
      </p>

      <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
        I build AI systems that run in production, not in slide decks.
      </h1>

      <p className="mt-6 max-w-prose text-lg text-muted">
        Newsreader for display, Geist for body, Geist Mono for technical
        identifiers. One accent, used with discipline.
      </p>

      <hr className="my-16 border-line" />

      <section className="space-y-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Type scale
        </h2>
        <p className="font-display text-6xl tracking-tight">Display 6xl</p>
        <p className="font-display text-4xl tracking-tight">Display 4xl</p>
        <p className="font-display text-2xl italic">Newsreader italic, for emphasis</p>
        <p className="text-base">
          Body — Geist. The quick brown fox jumps over the lazy dog while a
          scheduling migration keeps ~30 schools live in production.
        </p>
        <p className="font-mono text-sm text-muted">
          font-mono · openWakeWord → faster-whisper → LLM → Piper TTS
        </p>
      </section>

      <hr className="my-16 border-line" />

      <section className="space-y-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Palette
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-16 w-full rounded ${s.className}`} />
              <p className="mt-2 font-mono text-xs">{s.name}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-16 border-line" />

      <blockquote className="border-l-2 border-accent pl-6 font-display text-2xl italic leading-snug">
        Editorial, not decorative. A system that respects its reader.
      </blockquote>
    </main>
  );
}
