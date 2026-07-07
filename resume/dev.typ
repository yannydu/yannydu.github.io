#import "template.typ": *

#show: resume.with(
  name: [Danny #text(weight: "bold")[Yu]],
  role: "Full-Stack Engineer · Internal Platforms for STEM Education",
  contacts: (
    link("mailto:danny_yu_2@sfu.ca", "danny_yu_2@sfu.ca"),
    link("https://yannydu.github.io", "yannydu.github.io"),
    link("https://github.com/yannydu", "github.com/yannydu"),
  ),
)

#section("Summary")
Full-stack engineer who builds and operates the internal platforms behind
SFU's K-12 STEM outreach program: a publishing pipeline for camper projects,
a curriculum system, and the public lesson sites used in class, running on
Cloudflare Workers. Because the users are children, much of the engineering
is privacy work — real names kept out of repos, databases, and backups by
construction. Ships with Claude Code as a daily tool, owning the
architecture, privacy model, and operations end to end.

#section("Skills")
#skills((
  ("Daily drivers", "Python, JavaScript, HTML / CSS, Typst, git, Linux"),
  (
    "Ship with (AI-assisted, still internalizing)",
    "TypeScript, Astro / Hono, Cloudflare (Workers, Pages, D1, R2), Docker",
  ),
  (
    "AI-assisted development",
    "Claude Code as a daily tool — custom skills, hooks, and subagents; taking a spec to a deployed system and owning what ships",
  ),
))

#section("Work Experience")
#entry(
  "SFU Science Alive (Faculty of Applied Sciences Outreach)",
  "School Programs and Instructional Lead",
  "Burnaby, BC",
  "Jun. 2021 – Present",
)
- Built *spark-gallery*, a publishing platform that turns each camp week into
  an issue of an online magazine, with camper-built games playable in the
  browser (Astro on Cloudflare Workers, D1, R2). Live through a full summer
  of camps.
- Designed its privacy model for minors: camper names are pseudonymized
  before anything reaches the repo, and camper-written code is served from an
  isolated origin so it can never touch the gallery's cookies.
- Built *campkit*, the program's curriculum platform (Hono + Drizzle on
  Workers, Microsoft SSO): activities are written once and assembled into
  camps, replacing a Word-document workflow.
- Run *hello-wattson*, the public lesson site covering fourteen programs
  (Eleventy on Cloudflare Pages), with a daily cron rebuild that keeps
  program dates current.
- Teach coding camps (Python, web dev, Arduino, LEGO robotics) and authored
  SPARK, the program's workshop-design framework.

#entry(
  "Global Relay",
  "Software Development Engineer in Test (Co-op)",
  "Vancouver, BC",
  "Jan. 2023 – Aug. 2023",
)
- Built a Java JSON response builder for API validation and generated Java
  bindings from Thrift IDLs, integrating them with Wiremock containers for
  test stubs.
- Implemented a single source of truth for regression tests using the Trino
  REST API.

#entry(
  "Incognito Software Systems Inc.",
  "QA Engineer Intern",
  "Vancouver, BC",
  "Jan. 2022 – Aug. 2022",
)
- Wrote automated GUI tests in Java and Selenium and set up a Docker +
  Jenkins continuous-testing environment.

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
