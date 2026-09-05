# Thomas Stock, resume

Static resume site at https://www.stackhouse.be, built with Astro.

One typed data file, `src/data/resume.ts`, renders every output:

| Output | Path |
| --- | --- |
| Web page | `/` |
| PDF, one A4 page | `/ThomasStock.pdf` |
| JSON Resume | `/resume.json` |
| Markdown | `/resume.md` |
| llms.txt | `/llms.txt` |
| Open Graph image | `/og.png` |

## Commands

```sh
npm install
npx playwright install chromium   # once, for PDF and og.png rendering
npm run dev                       # http://localhost:4321
npm run build                     # astro build, then renders PDF and og.png into dist/
npm test                          # checks dist/ (run after build)
npm run check                     # astro check
```

`npm run build` fails when the PDF is not exactly one page.

## Deploying

The build needs Chromium for the PDF and og.png step. On GitHub Actions the workflow in `.github/workflows/ci.yml` installs it. On a hosting provider, set the install command to `npm ci && npx playwright install chromium`. If the provider's build image cannot launch Chromium, use `npm run build:web` there and let CI produce the PDF.
