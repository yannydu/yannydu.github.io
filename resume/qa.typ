#import "template.typ": *

#let r = json("resume.json")
#let by-id(id) = r.experience.find(e => e.id == id)

#show: resume.with(
  name: [Danny #text(weight: "bold")[Yu]],
  role: "SDET · QA Automation",
  contacts: r.contacts.map(c => link(c.url, c.label)),
)

#section("Summary")
Software developer in test with a foundation in test automation, API
validation, and CI/CD from SDET and QA co-ops. Now building and operating
production web platforms for SFU's STEM outreach program. Comfortable owning
quality end to end, from Selenium suites and Wiremock stubs to running live
services with real users.

#section("Skills")
#skills((
  (
    "Test automation (co-op experience)",
    "Java, Selenium, Wiremock, Jenkins, Docker, SQL / Trino",
  ),
  ("Daily drivers", "Python, JavaScript, HTML / CSS, git, Linux"),
  (
    "Current tooling",
    "`node --test`, Vitest, gitleaks, GitHub Actions, Cloudflare Workers / D1",
  ),
  (
    "AI-assisted development",
    "Claude Code as a daily tool: custom skills, hooks, and subagents",
  ),
))

#section("Work Experience")
#entry-from(by-id("sfu"), bullets: (
  "Build and operate the program's production web platforms on Cloudflare Workers: a publishing gallery (509 camper projects from 416 campers), a curriculum system (356 activities by six writers), and public lesson sites (hundreds of visits a month), through a full summer of camps with zero worker errors.",
  "Own quality on all of them: `node --test` suite (51 files) on the gallery, Vitest suite on the curriculum platform, gitleaks full-history scan and typecheck/lint gates in CI on every push.",
  "Enforce privacy constraints as tested invariants: camper names pseudonymized before data reaches repos or backups, a fail-closed pre-push name guard, EXIF/GPS stripping verified in CI, camper-written code isolated on its own origin. Also teach K-8 coding camps.",
))

#entry-from(by-id("globalrelay"), bullets: (
  "Implemented a single source of truth for regression tests using the Trino REST API.",
  "Built a JSON response builder in Java to validate API responses, eliminating manual response creation and improving efficiency.",
  "Generated Java language bindings from Thrift IDLs and integrated them with Wiremock containers to create test stub responses.",
))

#entry-from(by-id("incognito"), bullets: (
  "Wrote automated tests in Java and Selenium for product GUIs and maintained a regression test schedule.",
  "Established a Docker and Jenkins-based continuous-testing environment, reducing infrastructure overhead.",
))

#section("Projects")
#for e in r.projects { entry-from(e) }

#section("Education")
#for e in r.education { entry-from(e) }
