import { coreSkills, person, site, summary, yearsOfExperience } from "../data/resume";

/** schema.org Person for the <head>. `image` is the optimized portrait URL, resolved at build. */
export function toJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    description: summary(yearsOfExperience),
    url: site.url,
    email: `mailto:${person.email}`,
    image: imageUrl,
    address: { "@type": "PostalAddress", addressCountry: person.location.countryCode },
    sameAs: person.profiles.map((p) => p.url),
    knowsAbout: coreSkills,
    knowsLanguage: person.languages.map((l) => l.code),
    worksFor: {
      "@type": "Organization",
      name: person.business.name,
      vatID: person.business.vat.replace(/[\s.]/g, ""),
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: person.education[0].institution },
  };
}
