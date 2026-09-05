# Resume site

Personal resume of Thomas Stock. Astro static site, deployed at https://www.stackhouse.be.

## Single source of truth

`src/data/resume.ts`. Every output renders from it:

- HTML: `src/pages/index.astro` and `src/components/*`
- PDF and og.png: `scripts/render-artifacts.mjs` (Playwright, runs after `astro build`)
- `/resume.json`: `src/pages/resume.json.ts` via `src/lib/jsonresume.ts` (JSON Resume schema)
- `/resume.md`: `src/pages/resume.md.ts` via `src/lib/markdown.ts`
- `/llms.txt`: `src/pages/llms.txt.ts`

Never put resume copy anywhere else.

## Commands

- `npm run dev`
- `npm run build`: `astro build`, then renders `dist/ThomasStock.pdf` and `dist/og.png`. Fails if the PDF is not exactly one A4 page.
- `npm test`: checks `dist/`. Run after build.
- `npm run check`: `astro check`.

## Rules

- No hardcoded years of experience. Derive from `person.startYear`.
- When content changes, bump `now.updated`. Tests fail when it is older than 120 days.
- Print CSS lives next to screen CSS in each component. All sizes in rem; print scales through `html { font-size }` in `src/styles/global.css`.
- The PDF stays at one page. If the build fails on page count, cut copy. Do not shrink type below 8.5pt.
- Strings in `resume.ts` may use `*emphasis*` and `[text](https://url)`, handled by `src/lib/inline.ts`. No other markup.
- Numbers in bullets must be real. `TODO(thomas)` markers in `resume.ts` list the ones still missing.
- Fonts are self-hosted through Fontsource packages. No third-party CDNs.
- No client-side JavaScript except the copy-to-clipboard button in `Actions.astro`.
