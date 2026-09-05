/**
 * Post-build step. Serves dist/ locally, then with Playwright:
 *   1. prints / to dist/ThomasStock.pdf (A4, print media) and fails if it is not exactly one page
 *   2. screenshots /og/ to dist/og.png (1200x630)
 * Run after `astro build`. Needs `npx playwright install chromium` once.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import http from "node:http";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dist = join(root, "dist");
const pdfPath = join(dist, "ThomasStock.pdf");
const ogPath = join(dist, "og.png");

if (!existsSync(join(dist, "index.html"))) {
  console.error("dist/index.html missing. Run `astro build` first.");
  process.exit(1);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  let file = join(dist, pathname);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(dist) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
try {
  // 1. PDF
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.evaluate(() => document.fonts.ready);
  const pdfBytes = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });

  const doc = await PDFDocument.load(pdfBytes, { updateMetadata: false });
  const pages = doc.getPageCount();
  if (pages !== 1) {
    console.error(`PDF is ${pages} pages, expected 1. Cut copy in src/data/resume.ts.`);
    process.exit(1);
  }

  const title = await page.title();
  const description = await page.getAttribute('meta[name="description"]', "content");
  doc.setTitle(title);
  doc.setAuthor("Thomas Stock");
  doc.setSubject(description ?? "");
  doc.setKeywords(["React", "TypeScript", "front-end", "lead", "freelance", "Playwright", "React Native"]);
  doc.setCreator("stackhouse.be, Astro + Playwright");
  doc.setProducer("Chromium");
  await writeFile(pdfPath, await doc.save());
  console.log(`dist/ThomasStock.pdf  1 page, ${(statSync(pdfPath).size / 1024).toFixed(0)} KB`);

  // 2. Open Graph image
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await og.goto(`${origin}/og/`, { waitUntil: "networkidle" });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: ogPath, type: "png" });
  console.log(`dist/og.png           1200x630, ${(statSync(ogPath).size / 1024).toFixed(0)} KB`);
} finally {
  await browser.close();
  server.close();
}

