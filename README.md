# gabrieldebarnot.gdtx.fr

Bilingual (EN/FR) personal portfolio for Gabriel Debarnot. One identity, three
angles: `/ai`, `/security`, `/engineering` reframe the same projects for
different audiences.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 ·
MDX · self-hosted fonts · deployed on Vercel. No component library, no i18n
library — the site is small and those are long-term liabilities.

The one rule that shapes everything: **content lives in typed data under
`/content`, never in JSX.** Components read from it. Adding a project is adding
an object, not touching a component. A missing required field fails the build.

---

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000 → redirects to /en or /fr
```

```bash
pnpm build        # production build (also type-checks)
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
```

Requires Node 22+ and pnpm 11+.

---

## Where things live

```
app/[locale]/            Routes. [locale] is "en" | "fr".
  layout.tsx             <html>, header/footer, metadata, JSON-LD, boot script
  page.tsx               Home
  ai|security|engineering/  Angle pages (thin — they call <AnglePage angle=…>)
  about/
  work/[slug]/           Project detail (renders the MDX write-up)
  */opengraph-image.tsx  Per-route OG images (next/og)
content/                 ALL copy and data (this is what you edit)
  types.ts               The content contracts. Read this first.
  site.ts                Name, URL, contact, thesis, "now" line, languages
  projects.ts            The projects (+ angle framings)
  projects/*.mdx         Long-form write-ups, one file per project per locale
  experience.ts skills.ts angles.ts about.ts seo.ts ui.ts
components/              Presentational only — no copy lives here
  ui/                    Primitives (Container, Section, Heading, Tag, …)
  chrome/                Header, footer, toggles
lib/                     i18n resolver, fonts, seo helper, og renderer, cn
```

Everything you'll normally edit is in `/content`. You should rarely need to
touch `/components`.

---

## How to… (the three things you'll actually do)

### Add a project

1. Add one object to the array in **`content/projects.ts`**. TypeScript will
   tell you if you miss a field (that's intentional — `slug`, `name`, `period`,
   `tagline`, `summary`, `stack`, `primaryAngle`, `angles`, `links`,
   `isPrivate`, `hasWriteup`, `featured` are all required).

   The `angles` field is the reframing mechanism. Give it an entry per angle the
   project supports — each with its own `headline`, `summary`, and highlighted
   `stack`:

   ```ts
   angles: {
     ai: { headline: { en: "…", fr: "…" }, summary: { en: "…", fr: "…" }, stack: ["…"] },
     engineering: { … },
   }
   ```

   On `/ai` the project shows its `angles.ai` framing; on the home page it shows
   the neutral `tagline`/`summary`.

2. If `hasWriteup: true`, add **two** MDX files (one per locale):
   `content/projects/<slug>.en.mdx` and `content/projects/<slug>.fr.mdx`, then
   register them in **`content/projects/writeups.ts`** (add the two `import`
   lines — they're explicit so bundling stays deterministic).

   Write-ups start at a `## Problem` heading (no title — the page renders it) and
   follow: Problem → Constraints → Approach → What shipped → What I'd do
   differently.

3. `featured: true` surfaces it in the home "Selected work" section.

### Add or change a UI string

All interface text is in **`content/ui.ts`** as `{ en, fr }` pairs. Add a key,
give both languages, and read it in a component with `t(ui.section.key, locale)`.
Every leaf must have both locales or the build fails.

### Change the accent colour

Edit **`app/globals.css`**. The accent is defined **twice** — once for light,
once for dark (dark is lifted for contrast):

```css
:root  { --accent: oklch(0.548 0.155 34); }   /* light */
.dark  { --accent: oklch(0.665 0.135 37); }   /* dark  */
```

Change both. If you change it a lot, also check `--accent-contrast` (the text
colour on accent fills) and re-verify WCAG AA against both `--paper` values.
That's the only place the accent is defined — every `text-accent` / `bg-accent`
utility flows from it.

> Design tokens (palette + fonts) all live in the same `@theme` block in
> `globals.css`. Fonts are Newsreader (display) / Geist (body) / Geist Mono
> (code), wired in `lib/fonts.ts`.

---

## Git workflow & CI

- `main` — production only (deploys to the live domain).
- `dev` — integration branch. Feature branches (`feat/*`, `fix/*`) merge here
  via PR; release = PR `dev` → `main`.
- **CI** (`.github/workflows/ci.yml`) runs `typecheck` + `lint` + `build` on
  every PR/push to `dev`/`main`. A red check blocks the merge.

---

## Deployment (Vercel + DNS)

1. Import the repo in Vercel. **Framework Preset must be `Next.js`** (if it says
   "Other", the build fails looking for a `public/` directory). Leave Build
   Command / Output Directory on their defaults.
2. Vercel → Settings → Git → **Production Branch = `main`**. You then get preview
   deploys for `dev` and every PR, production only from `main`.
3. Add the domain `gabrieldebarnot.gdtx.fr` in Vercel → Settings → Domains.
4. In the DNS zone for **`gdtx.fr`**, add:

   | Type  | Name              | Value                  |
   | ----- | ----------------- | ---------------------- |
   | CNAME | `gabrieldebarnot` | `cname.vercel-dns.com` |

   (Apex/root domains would use an `A` record to Vercel's IP, but this is a
   subdomain, so CNAME is correct.) Vercel provisions the TLS certificate
   automatically once the record resolves.

---

## Quality bar

Lighthouse (desktop, production build) — verified on home, an angle page, and a
work page:

| Metric         | Score |
| -------------- | ----- |
| Performance    | 100   |
| Accessibility  | 100   |
| Best Practices | 100   |
| SEO            | 100   |

Fully keyboard navigable, WCAG AA in both themes, semantic landmarks,
`prefers-reduced-motion` respected. Search `// TODO: verify` before launch —
those mark inferred facts (mostly dates and figures) to confirm.
