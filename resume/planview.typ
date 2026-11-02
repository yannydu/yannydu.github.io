// Planview: Software Engineer I (Vancouver / Burnaby)
// compile: typst compile --pdf-standard ua-1 planview.typ Danny_Yu_Resume_Planview.pdf
#import "template.typ": *

#let r = json("resume.json")
#let by-id(id) = r.experience.find(e => e.id == id)

#show: resume.with(
  name: [Danny #text(weight: "bold")[Yu]],
  role: "Software Engineer · Full-Stack Web Platforms",
  contacts: r.contacts.map(c => link(c.url, c.label)),
)

#section("Summary")
Computer Engineering graduate (SFU, 2025) with Java experience from SDET and QA
co-ops, now building and operating three production web platforms for SFU's
STEM outreach program. Built a curriculum platform where each activity is written once and reused across camps, ships behind CI, and uses agentic development daily: Claude Code with
custom skills, hooks, and subagents, while owning the architecture and
operations.

#section("Skills")
#skills((
  ("Daily drivers", "Python, JavaScript, HTML / CSS, Typst, git, Linux"),
  (
    "Ship with (AI-assisted, still internalizing)",
    "TypeScript, Astro / Hono, Drizzle, Cloudflare (Workers, D1, R2), Docker",
  ),
  ("Co-op experience", "Java, SQL / Trino, Thrift, Wiremock, Selenium, Jenkins"),
  (
    "Agentic development",
    "Claude Code as a daily tool: custom skills, hooks, and subagents; taking a spec to a deployed system and owning what ships",
  ),
))

#section("Work Experience")
#entry-from(by-id("sfu"), bullets: (
  "Built *campkit*, the program's curriculum platform (Hono + Drizzle on Workers; Cloudflare Access with SFU accounts). An activity is written once and assembled into camps: 356 activities and 25 camps authored by six curriculum writers, succeeding my Python + Typst pipeline.",
  "Built *spark-gallery*, a publishing platform for camper projects (Astro on Cloudflare Workers, D1, R2). Live through a full summer of camps: 509 camper projects from 416 campers, zero worker errors.",
  "Ship behind CI on every push: typecheck, lint, `node --test` and Vitest suites, and a full-history gitleaks scan; a nightly GitHub Actions rebuild keeps *hello-wattson*, the public lesson site (54 lessons, hundreds of visits a month), current.",
  "Designed the gallery's privacy model for minors: camper names pseudonymized before anything reaches the repo, and camper-written code served from an isolated origin so it can never touch the gallery's cookies.",
  "Build with Claude Code using custom skills, hooks, and subagents; the architecture, privacy, and operations decisions are mine.",
))

#entry-from(by-id("globalrelay"), bullets: (
  "Built a JSON response builder in Java to validate API responses, and generated Java bindings from Thrift IDLs, integrating them with Wiremock containers for test stubs.",
  "Implemented a single source of truth for regression tests using the Trino REST API.",
))

#entry-from(by-id("incognito"), bullets: (
  "Wrote automated GUI tests in Java and Selenium and maintained a regression test schedule.",
  "Established a Docker and Jenkins-based continuous-testing environment, reducing infrastructure overhead.",
))

#section("Projects")
#for e in r.projects { entry-from(e) }

#section("Education")
#for e in r.education { entry-from(e) }
