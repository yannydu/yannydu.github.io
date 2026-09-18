#import "template.typ": *

#show: resume.with(
  name: [Danny #text(weight: "bold")[Yu]],
  role: "SDET · QA Automation",
  contacts: (
    link("mailto:danny_yu_2@sfu.ca", "danny_yu_2@sfu.ca"),
    link("https://yannydu.github.io", "yannydu.github.io"),
    link("https://github.com/yannydu", "github.com/yannydu"),
  ),
)

#section("Summary")
Software developer in test with a foundation in test automation, API
validation, and CI/CD from SDET and QA co-ops — now building and operating
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
    "node --test, Vitest, gitleaks, GitHub Actions, Cloudflare Workers / D1",
  ),
  (
    "AI-assisted development",
    "Claude Code as a daily tool — custom skills, hooks, and subagents",
  ),
))

#section("Work Experience")
#entry(
  "SFU Science Alive (Faculty of Applied Sciences Outreach)",
  "School Programs and Instructional Lead",
  "Burnaby, BC",
  "Jun. 2021 – Present",
)
- Build and operate the program's production web platforms on Cloudflare
  Workers — a publishing gallery (509 camper projects from 416 campers), a
  curriculum system (356 activities by six writers), and public lesson sites
  (hundreds of classroom visits a month) — a full summer of camps with zero
  worker errors.
- Own quality on all of them: node --test suite (51 files) on the gallery,
  Vitest suite on the curriculum platform, gitleaks full-history scan and
  typecheck/lint gates in CI on every push.
- Enforce privacy constraints as tested invariants: camper names
  pseudonymized before data reaches repos or backups, a fail-closed pre-push
  name guard, EXIF/GPS stripping verified in CI, camper-written code isolated
  on its own origin. Also teach K-8 coding camps.

#entry(
  "Global Relay",
  "Software Development Engineer in Test (Co-op)",
  "Vancouver, BC",
  "Jan. 2023 – Aug. 2023",
)
- Implemented a single source of truth for regression tests using the Trino
  REST API.
- Built a JSON response builder in Java to validate API responses,
  eliminating manual response creation and improving efficiency.
- Generated Java language bindings from Thrift IDLs and integrated them with
  Wiremock containers to create test stub responses.

#entry(
  "Incognito Software Systems Inc.",
  "QA Engineer Intern",
  "Vancouver, BC",
  "Jan. 2022 – Aug. 2022",
)
- Wrote automated tests in Java and Selenium for product GUIs and maintained
  a regression test schedule.
- Established a Docker and Jenkins-based continuous-testing environment,
  reducing infrastructure overhead.

#section("Projects")
#entry(
  "ChessMate — A Smart Automated Chessboard",
  "SFU ENSC Capstone",
  "Burnaby, BC",
  "Jan. 2024 – Aug. 2024",
)
- Built the human-move detection module with a Raspberry Pi camera and
  OpenCV, comparing board states to identify the moved piece; drove an
  electromagnetic trolley in Python to execute the machine's moves.

#section("Education")
#entry(
  "Simon Fraser University",
  "BASc in Computer Engineering",
  "Burnaby, BC",
  "Graduated 2025",
)
