import {
  allRoles, coreSkills, moreSkills, now, person, site, summary, yearsOfExperience,
} from "../data/resume";
import { inlinePlain } from "./inline";

/** https://jsonresume.org/schema */
export function toJsonResume() {
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: person.name,
      label: `${person.role} (${person.engagement.toLowerCase()})`,
      email: person.email,
      url: site.url,
      summary: summary(yearsOfExperience),
      location: { countryCode: person.location.countryCode, region: person.location.label },
      profiles: person.profiles.map((p) => ({ network: p.network, username: p.username, url: p.url })),
    },
    work: allRoles().map((r) => ({
      name: r.company,
      position: r.title,
      ...(r.url ? { url: r.url } : {}),
      startDate: r.start,
      ...(r.end ? { endDate: r.end } : {}),
      ...(r.subtitle ? { summary: r.subtitle } : {}),
      highlights: r.bullets,
      ...(r.stack ? { keywords: r.stack } : {}),
    })),
    education: person.education.map((e) => ({
      institution: e.institution,
      area: e.area,
      studyType: e.studyType,
      startDate: e.start,
      endDate: e.end,
    })),
    skills: [
      { name: "Core", level: "Expert", keywords: coreSkills },
      { name: "Also worked with", keywords: moreSkills },
    ],
    languages: person.languages.map((l) => ({ language: l.language, fluency: l.fluency })),
    meta: {
      canonical: `${site.url}/resume.json`,
      version: "v1.0.0",
      lastModified: now.updated,
      source: site.repo,
      now: now.items.map(inlinePlain),
    },
  };
}
