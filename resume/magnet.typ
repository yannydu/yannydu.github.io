// Magnet Forensics: Software Development Engineer in Test
// compile: typst compile --pdf-standard ua-1 magnet.typ Danny_Yu_Resume_Magnet.pdf
#import "template.typ": *

#let r = json("resume.json")
#let by-id(id) = r.experience.find(e => e.id == id)

#show: resume.with(
  name: [Danny #text(weight: "bold")[Yu]],
  role: "SDET · Test Automation & CI/CD",
  contacts: r.contacts.map(c => link(c.url, c.label)),
)

#section("Summary")
Software developer in test with API testing, test automation, and CI/CD
experience from SDET and QA co-ops. Now builds and operates production web
platforms for SFU's STEM outreach program, where every push runs through test
suites and CI gates. Python is a daily driver; comfortable owning quality end
to end, from Wiremock stubs and Selenium suites to running live services with
real users.

#section("Skills")
#skills((
  (
    "Test automation (co-op experience)",
    "Java, Selenium, Wiremock, Jenkins, Docker, SQL / Trino",
  ),
  ("Daily drivers", "Python, JavaScript, HTML / CSS, git, Linux"),
  (
    "Current tooling (AI-assisted)",
    "`node --test`, Vitest, gitleaks, GitHub Actions, Cloudflare Workers / D1",
  ),
  (
    "AI-assisted development",
    "Claude Code as a daily tool: custom skills, hooks, and subagents",
  ),
))

#section("Work Experience")
#entry-from(by-id("globalrelay"), bullets: (
  "Built a JSON response builder in Java to validate API responses, eliminating manual response creation.",
  "Generated Java language bindings from Thrift IDLs and integrated them with Wiremock containers to create test stub responses.",
  "Implemented a single source of truth for regression tests using the Trino REST API.",
))

#entry-from(by-id("incognito"), bullets: (
  "Wrote automated tests in Java and Selenium for product GUIs and maintained a regression test schedule.",
  "Established a Docker and Jenkins-based continuous-testing environment, reducing infrastructure overhead.",
))

#entry-from(by-id("sfu"), bullets: (
  "Own quality on the program's production platforms: `node --test` suite (51 files) on the gallery, Vitest suite on the curriculum platform, and typecheck, lint, and full-history gitleaks gates in CI on every push.",
  "Enforce privacy constraints as tested invariants: camper names pseudonymized before data reaches repos or backups, a fail-closed pre-push name guard, EXIF/GPS stripping verified in CI, camper-written code isolated on its own origin.",
  "Build and operate the platforms on Cloudflare Workers: a publishing gallery (509 camper projects from 416 campers, zero worker errors through a full summer), a curriculum system (356 activities by six writers) replacing my earlier Python + Typst pipeline, and a public lesson site (hundreds of visits a month). Built with Claude Code; I own the test strategy and CI gates.",
  "Teach coding camps (Python, web dev, Arduino, LEGO robotics).",
))

#section("Projects")
#for e in r.projects { entry-from(e) }

#section("Education")
#for e in r.education { entry-from(e) }
