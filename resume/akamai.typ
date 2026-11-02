// Akamai: Software Development Engineer in Test (Python), entry level
// compile: typst compile --pdf-standard ua-1 akamai.typ Danny_Yu_Resume_Akamai.pdf
#import "template.typ": *

#let r = json("resume.json")
#let by-id(id) = r.experience.find(e => e.id == id)

#show: resume.with(
  name: [Danny #text(weight: "bold")[Yu]],
  role: "SDET · Python, Linux & CI",
  contacts: r.contacts.map(c => link(c.url, c.label)),
)

#section("Summary")
Computer Engineering graduate (SFU, 2025) and software developer in test, with
Python and Linux as daily drivers. Built test automation and a Docker + Jenkins
continuous-testing environment in SDET and QA co-ops, and now runs production
web platforms behind CI on every push. Capstone work on a Raspberry Pi
paired Python with a camera and an electromagnetic trolley.

#section("Skills")
#skills((
  ("Daily drivers", "Python, JavaScript, HTML / CSS, git, Linux"),
  (
    "Test automation (co-op experience)",
    "Java, Selenium, Wiremock, Jenkins, Docker, SQL / Trino",
  ),
  (
    "Current tooling (AI-assisted)",
    "GitHub Actions, `node --test`, Vitest, gitleaks, Cloudflare Workers / D1",
  ),
  ("Embedded (capstone)", "Raspberry Pi (ARM), OpenCV, Python"),
  (
    "AI-assisted development",
    "Claude Code as a daily tool: custom skills, hooks, and subagents",
  ),
))

#section("Work Experience")
#entry-from(by-id("globalrelay"), bullets: (
  "Generated Java language bindings from Thrift IDLs and integrated them with Wiremock containers to create test stub responses.",
  "Built a JSON response builder in Java to validate API responses, and implemented a single source of truth for regression tests using the Trino REST API.",
))

#entry-from(by-id("incognito"), bullets: (
  "Established a Docker and Jenkins-based continuous-testing environment, reducing infrastructure overhead.",
  "Wrote automated tests in Java and Selenium for product GUIs and maintained a regression test schedule.",
))

#entry-from(by-id("sfu"), bullets: (
  "Own quality on the program's production platforms: `node --test` suite (51 files) and Vitest suite, with typecheck, lint, and full-history gitleaks gates in CI on every push; a nightly GitHub Actions rebuild keeps the public lesson site current.",
  "Enforce privacy constraints as tested invariants: a fail-closed pre-push name guard, EXIF/GPS stripping verified in CI, camper-written code isolated on its own origin.",
  "Build and operate the platforms on Cloudflare Workers: a publishing gallery (509 camper projects from 416 campers, zero worker errors through a full summer) and a curriculum system (356 activities by six writers) replacing my earlier Python + Typst pipeline. Built with Claude Code; I own the test strategy and CI gates.",
  "Teach coding camps (Python, web dev, Arduino, LEGO robotics).",
))

#section("Projects")
#for e in r.projects { entry-from(e) }

#section("Education")
#for e in r.education { entry-from(e) }
