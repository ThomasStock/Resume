/**
 * Checks the built output in dist/. Run `npm run build` first.
 * Node's built-in test runner, no framework.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";

const dist = resolve(fileURLToPath(new URL("..", import.meta.url)), "dist");
const read = (f) => readFileSync(join(dist, f), "utf8");

test("dist exists", () => {
  assert.ok(existsSync(join(dist, "index.html")), "run `npm run build` first");
});

test("index.html has metadata for humans, crawlers and LLMs", () => {
  const html = read("index.html");
  assert.match(html, /<meta name="description" content=".+"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /rel="alternate" type="application\/json"/);
  const ld = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
  assert.ok(ld, "JSON-LD block missing");
  const person = JSON.parse(ld[1]);
  assert.equal(person["@type"], "Person");
  assert.equal(person.name, "Thomas Stock");
  assert.ok(person.sameAs.length >= 3);
});

test("index.html has no hardcoded years of experience", () => {
  const years = new Date().getFullYear() - 2006;
  const html = read("index.html");
  assert.doesNotMatch(html, /18 years/);
  assert.match(html, new RegExp(`${years} years`));
});

test("index.html loads no third-party resources", () => {
  const html = read("index.html");
  const resources = [
    ...[...html.matchAll(/\ssrc="(https?:\/\/[^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<link[^>]+href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]),
  ].filter((u) => !u.startsWith("https://www.stackhouse.be/"));
  assert.deepEqual(resources, []);
});

test("resume.json is valid JSON Resume", () => {
  const json = JSON.parse(read("resume.json"));
  assert.equal(json.basics.name, "Thomas Stock");
  assert.ok(json.basics.profiles.length >= 3);
  assert.ok(json.work.length >= 6, "all roles, including the condensed early ones");
  assert.ok(json.work.every((w) => /^\d{4}(-\d{2})?$/.test(w.startDate)));
  assert.ok(json.skills[0].keywords.length <= 10, "core skills stay short");
});

test("resume.md and llms.txt render", () => {
  assert.match(read("resume.md"), /^# Thomas Stock\n/);
  assert.match(read("resume.md"), /## Experience/);
  assert.match(read("llms.txt"), /^# Thomas Stock\n/);
  assert.match(read("llms.txt"), /resume\.json/);
});

test("Now block is fresh", () => {
  const { meta } = JSON.parse(read("resume.json"));
  const ageDays = (Date.now() - new Date(meta.lastModified).getTime()) / 86_400_000;
  assert.ok(ageDays < 120, `now.updated is ${Math.round(ageDays)} days old. Update it in src/data/resume.ts.`);
});

test("PDF is one A4 page with metadata", async () => {
  const bytes = readFileSync(join(dist, "ThomasStock.pdf"));
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  assert.equal(doc.getPageCount(), 1);
  assert.match(doc.getTitle() ?? "", /Thomas Stock/);
  const { width, height } = doc.getPage(0).getSize();
  assert.ok(Math.abs(width - 595) < 2 && Math.abs(height - 842) < 2, `not A4: ${width}x${height}`);
});

test("og.png exists and is not empty", () => {
  assert.ok(statSync(join(dist, "og.png")).size > 20_000);
});
