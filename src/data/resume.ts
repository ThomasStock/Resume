/**
 * Single source of truth for the resume.
 * Everything renders from this file: HTML, PDF, og.png, resume.json, resume.md, llms.txt.
 *
 * TODO(thomas) markers flag copy that wants a real number or a wording check.
* Dates: "YYYY" or "YYYY-MM". An undefined `end` means present.
 * Strings may use *emphasis* and [text](https://url); see src/lib/inline.ts. Nothing else.
 */

export const site = {
  url: "https://www.stackhouse.be",
  repo: "https://github.com/ThomasStock/Resume",
} as const;

export const person = {
  name: "Thomas Stock",
  role: "Lead Front-end Engineer",
  engagement: "Freelance",
  startYear: 2006,
  location: { label: "Belgium", countryCode: "BE", remote: true },
  // TODO(thomas): e.g. "Available from January 2027". Rendered only when set.
  availability: null as string | null,
  email: "thomasstock1985@gmail.com",
  business: { name: "Stackhouse BV", vat: "BE 0802.112.992" },
  languages: [
    { language: "Dutch", fluency: "Native", code: "nl" },
    { language: "English", fluency: "Fluent", code: "en" },
  ],
  education: [
    {
      institution: "Katholieke Hogeschool Sint-Lieven",
      studyType: "Bachelor",
      area: "ICT",
      start: "2003",
      end: "2006",
    },
  ],
  profiles: [
    { network: "GitHub", username: "ThomasStock", url: "https://github.com/ThomasStock" },
    { network: "LinkedIn", username: "stockthomas", url: "https://www.linkedin.com/in/stockthomas/" },
    { network: "Stack Overflow", username: "72859", url: "https://stackoverflow.com/users/72859" },
  ],
} as const;

export const yearsOfExperience = new Date().getFullYear() - person.startYear;

// TODO(thomas): confirm wording of the second sentence.
/** Two sentences. The first doubles as meta description and Open Graph text. */
export const summaryParts = (years: number): [string, string] => [
  `Product-minded front-end lead with ${years} years of shipping web software, from .NET to React.`,
  `I own architecture, grow teams and set the conventions that keep a codebase healthy when humans and AI both write the code.`,
];

export const summary = (years: number) => summaryParts(years).join(" ");

export const now = {
  updated: "2026-09-05",
  items: [
    "Figuring out how *anyone* can ship with AI responsibly: guardrails, review, tests, conventions.",
    "Researching what a developer's job is now, and what it should be next.",
    "Leading front-end at [Peripass](https://peripass.com). Making the codebase AI-ready through developer and agent experience: conventions, CI and fast feedback loops.",
  ],
};

export type Role = {
  company: string;
  url?: string;
  title: string;
  subtitle?: string;
  start: string;
  end?: string;
  bullets: string[];
  stack?: string[];
};

export const experience: Role[] = [
  {
    company: "Peripass",
    url: "https://peripass.com",
    title: "Freelance Lead Front-end Engineer",
    start: "2023-06",
    bullets: [
      // TODO(thomas): add an outcome, e.g. share of PRs that are AI-assisted, or cycle-time change.
      "Preparing the codebase and team for AI-assisted development: conventions, guardrails and a review flow so anyone can ship with AI responsibly.",
      // TODO(thomas): number of sites or users on the kiosk app.
      "Moving a legacy ASP.NET MVC front-end to React, including a responsive kiosk and mobile web app.",
      // TODO(thomas): number of devices or users.
      "Rewrote a legacy Xamarin app in React Native.",
      "Built the UI test framework on Playwright.",
    ],
  },
  {
    company: "Aprimo",
    title: "Lead React Developer",
    subtitle: "Joined as ASP.NET developer, React developer from 2017, lead from 2021",
    start: "2015",
    end: "2023-05",
    bullets: [
      "Technical lead for a team of about nine front-end developers: architecture, final pull-request reviews, long-term project health.",
      "Core architecture and UX guidance for a large enterprise React product.",
      "Mentored juniors and new hires, ran technical interviews.",
    ],
    stack: ["React", "Redux", "Redux-Saga", "TypeScript", "Material UI", "Webpack", "Cypress", "Jest"],
  },
];

export const earlier = {
  heading: "Earlier roles",
  start: "2006",
  end: "2014",
  summary:
    "Web, Windows and mobile apps on .NET at four companies: CMS implementations, kiosk and point-of-sale software, stock management on barcode scanners.",
  roles: [
    {
      company: "D Soft",
      title: ".NET Developer",
      start: "2013",
      end: "2014",
      bullets: [],
      stack: ["ASP.NET MVC", "Xamarin (iOS)", "Apache Cordova"],
    },
    {
      company: "Orbit One",
      title: ".NET Developer",
      start: "2010",
      end: "2012",
      bullets: [],
      stack: ["ASP.NET", "Umbraco CMS", "SharePoint 2010", "Dynamics CRM 2011", "MS SQL"],
    },
    {
      company: "TrustTeam",
      title: ".NET Developer",
      start: "2008",
      end: "2010",
      bullets: [
        "Stock management and point-of-sale apps on barcode scanning devices",
        "Self-registration kiosk software",
      ],
      stack: ["ASP.NET", "ASP.NET MVC", "jQuery", "WPF", "WinForms", "PHP", "MS SQL"],
    },
    {
      company: "Indiegroup",
      title: ".NET Developer",
      start: "2006",
      end: "2007",
      bullets: [],
      stack: ["ASP.NET", "Telerik controls", "MS SQL"],
    },
  ] satisfies Role[],
};

export const coreSkills = [
  "React",
  "TypeScript",
  "Front-end architecture",
  "Design systems",
  "Playwright",
  "React Native",
  "Web performance",
  "UX",
  "AI-assisted development",
];

export const moreSkills = [
  "Astro",
  "Vite",
  "Tailwind CSS",
  "shadcn/ui and Radix",
  "TanStack Query",
  "Redux and Redux-Saga",
  "Jest",
  "Cypress",
  "Material UI",
  "Webpack",
  "Svelte",
  "Node.js",
  "C# and ASP.NET MVC",
  "SQL and PostgreSQL",
  "Drizzle",
  "Supabase",
  "Vercel",
  "Sentry",
  "Azure DevOps",
  "GitHub Actions",
  "Pact",
  "Pendo",
  "Amplitude",
  "Claude Code",
  "jQuery",
  "Umbraco",
];

/** Every role, newest first, including the condensed early ones. */
export const allRoles = (): Role[] => [...experience, ...earlier.roles];

export const locationLabel = person.location.remote
  ? `${person.location.label}, remote`
  : person.location.label;
