import type { APIRoute } from "astro";
import {
  coreSkills, experience, locationLabel, now, person, site, summaryParts, yearsOfExperience,
} from "../data/resume";
import { formatPeriod } from "./../lib/format";

/* https://llmstxt.org */
export const GET: APIRoute = () => {
  const current = experience[0];
  const body = [
    `# ${person.name}`,
    "",
    `> ${person.role}, ${person.engagement.toLowerCase()} via ${person.business.name}, ${locationLabel}. ${summaryParts(yearsOfExperience)[0]}`,
    "",
    `Updated ${now.updated}.`,
    "",
    "## Resume",
    "",
    `- [Markdown](${site.url}/resume.md): full resume as plain Markdown`,
    `- [JSON Resume](${site.url}/resume.json): structured data, jsonresume.org schema v1.0.0`,
    `- [PDF](${site.url}/ThomasStock.pdf): one A4 page`,
    "",
    "## Facts",
    "",
    `- Role: ${person.role} (${person.engagement.toLowerCase()})`,
    `- Experience: since ${person.startYear} (${yearsOfExperience} years)`,
    `- Current: ${current.company}, ${current.title}, ${formatPeriod(current.start, current.end)}`,
    `- Core skills: ${coreSkills.join(", ")}`,
    `- Languages: ${person.languages.map((l) => l.language).join(", ")}`,
    `- Location: ${locationLabel}`,
    `- Contact: ${person.email}`,
    ...(person.availability ? [`- Availability: ${person.availability}`] : []),
    "",
    "## Now",
    "",
    ...now.items.map((i) => `- ${i}`),
    "",
    "## Profiles",
    "",
    ...person.profiles.map((p) => `- [${p.network}](${p.url})`),
    "",
    "## Source",
    "",
    `- [Repository](${site.repo}): this site is a codebase. One typed data file renders every format.`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
