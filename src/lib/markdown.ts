import {
  coreSkills, earlier, experience, locationLabel, moreSkills, now, person, site, summary, yearsOfExperience,
} from "../data/resume";
import { formatDate, formatPeriod } from "./format";

export function toMarkdown(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(`# ${person.name}`, "");
  push(`**${person.role}** · ${person.engagement} via ${person.business.name} · ${locationLabel}`, "");
  push(summary(yearsOfExperience), "");
  if (person.availability) push(person.availability, "");

  push("## Now", "", `_Updated ${formatDate(now.updated)}_`, "");
  for (const item of now.items) push(`- ${item}`);
  push("");

  push("## Experience", "");
  for (const job of experience) {
    push(`### ${job.url ? `[${job.company}](${job.url})` : job.company} · ${job.title}`, "");
    push(formatPeriod(job.start, job.end) + (job.subtitle ? ` · ${job.subtitle}` : ""), "");
    for (const b of job.bullets) push(`- ${b}`);
    if (job.stack) push("", `Stack: ${job.stack.join(", ")}`);
    push("");
  }
  push(`### ${earlier.heading}`, "", `${formatPeriod(earlier.start, earlier.end)}. ${earlier.summary}`, "");
  for (const r of earlier.roles) {
    const extra = [...r.bullets, ...(r.stack ?? [])].join(", ");
    push(`- **${r.company}** (${formatPeriod(r.start, r.end)}), ${r.title}: ${extra}`);
  }
  push("");

  push("## Skills", "");
  push(`**Core:** ${coreSkills.join(" · ")}`, "");
  push(`**Also worked with:** ${moreSkills.join(", ")}`, "");

  push("## Background", "");
  for (const e of person.education) {
    push(`- Education: ${e.studyType} ${e.area}, ${e.institution} (${formatPeriod(e.start, e.end)})`);
  }
  push(`- Languages: ${person.languages.map((l) => `${l.language} (${l.fluency.toLowerCase()})`).join(", ")}`);
  push(`- Business: ${person.business.name}, ${person.business.vat}`, "");

  push("## Contact", "");
  push(`- Email: ${person.email}`);
  for (const p of person.profiles) push(`- ${p.network}: ${p.url}`);
  push(`- Web: ${site.url}`, "");

  push("---", "");
  push(
    `Also available as [JSON Resume](${site.url}/resume.json), [PDF](${site.url}/ThomasStock.pdf) ` +
      `and [llms.txt](${site.url}/llms.txt). Source: ${site.repo}`,
    "",
  );
  return lines.join("\n");
}
