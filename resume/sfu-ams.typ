// SFU IT Services, Academic Management Systems: Application Developer (IFMS)
// cover letter + resume in one PDF, as the posting asks
// compile: typst compile --pdf-standard ua-1 sfu-ams.typ Danny_Yu_SFU_AMS_Application.pdf
#import "template.typ": *

#let r = json("resume.json")
#let by-id(id) = r.experience.find(e => e.id == id)
#let name = [Danny #text(weight: "bold")[Yu]]
#let role = "Full-Stack Developer · Web Applications, Testing & CI/CD"
#let contacts = r.contacts.map(c => link(c.url, c.label))

#show: resume.with(
  name: name,
  role: role,
  contacts: contacts,
  title: [Application],
)

// ---------- cover letter ----------
#set par(leading: 0.65em, spacing: 1.1em)
#set text(size: 10.5pt)
#v(14pt)
October 22, 2026

Hiring Committee \
Academic Management Systems, IT Services \
Simon Fraser University

*Re: Application Developer, Integrated Faculty Management System (IFMS)*

Dear Hiring Committee,

I'm applying for one of the two Application Developer positions on the IFMS
program. For the past five years I have worked inside an SFU faculty unit,
Science Alive in the Faculty of Applied Sciences. Over that time my role has
grown from instruction into building and running the web systems our staff
depend on. IFMS is the same kind of work at university scale: modernizing
how faculty and administrative staff get their work done. I'd like to do
that work on your team.

The closest match is *campkit*, the curriculum platform I built to replace our
Python + Typst document pipeline. Six curriculum writers use it behind SFU sign-in
to author 356 activities that are assembled into 25 camps. Building it meant
working out what the staff needed, designing a relational data model so an
activity is written once and reused, putting an API in front of it, and
migrating the existing content into it.
I also run a publishing platform (509 projects from 416 campers through a
full summer) and a public lesson site used in
classrooms. On all three I set up the CI/CD (automated checks and deploys on
every change), test suites, and documentation, and I handle operational
support.

My testing habits come from two co-ops. As an SDET (developer in test) at
Global Relay, I built API validation tooling in Java and Thrift-based test
stubs with Wiremock. At Incognito Software, I wrote Selenium test suites
and set up a Docker and Jenkins continuous-testing environment. That is the
system testing and CI/CD side of this role, and I've kept those habits since.

I want to be direct about the gaps. I have not shipped production PHP/Laravel
or React, and my database work so far is SQLite rather than MySQL, DB2, or
SQL Server. The patterns carry over: MVC-style routing and handlers,
ORM-managed schemas, REST endpoints, component-based front ends. Over the
past few years I have picked up TypeScript, Hono, Drizzle, and Cloudflare
Workers this way, and I would ramp up on your stack the same way.
My main tool is Claude Code. I direct the work: architecture, data handling, privacy, and day-to-day operations.

Because my users are children, privacy is designed in from the start: real
names never reach repositories, databases, or backups. I would bring that
same care to faculty and staff records. Thank you for your consideration. I
would welcome the chance to talk about IFMS.

Sincerely, \
Danny Yu

#pagebreak()

// ---------- resume ----------
#set par(leading: 0.5em, spacing: 1.2em)
#set text(size: 10pt)
#header(name, role, contacts)

#section("Summary")
Full-stack developer with an SFU Computer Engineering degree, two
test-automation co-ops, and five years in an SFU faculty unit. I build and
operate the internal web systems its staff use: a curriculum management
platform behind SFU sign-in, a publishing platform on a relational database,
and public lesson sites. I bring CI/CD, automated testing, and documentation
discipline from SDET and QA work. I build with Claude Code daily and own the
architecture, data model, privacy, and operations of what ships.

#section("Skills")
#skills((
  ("Daily drivers", "Python, JavaScript, HTML / CSS, git, Linux"),
  (
    "Web & data (AI-assisted, still internalizing)",
    "TypeScript, Hono APIs, Drizzle ORM, SQL (SQLite / Cloudflare D1), Astro, Cloudflare Workers",
  ),
  (
    "Testing & CI/CD",
    "Java, Selenium, Wiremock, Jenkins, Docker, GitHub Actions, `node --test`, Vitest, gitleaks",
  ),
  (
    "AI-assisted development",
    "Claude Code as a daily tool: custom skills, hooks, and subagents",
  ),
))

#section("Work Experience")
#entry-from(by-id("sfu"), bullets: (
  "Built *campkit*, the program's curriculum management platform (Hono + Drizzle on Cloudflare Workers, SFU sign-in via Cloudflare Access): six staff writers author 356 activities assembled into 25 camps, on a relational model where each activity is written once and reused. Migrated content off the earlier Python + Typst pipeline.",
  "Built *spark-gallery*, a publishing platform with a SQL database and object storage (Astro on Workers, D1, R2): 509 projects from 416 campers through a full summer.",
  "Run CI/CD on every push: typecheck, lint, `node --test` (51 files) and Vitest suites, and a full-history gitleaks scan. Data-privacy rules are tested invariants: names pseudonymized before reaching repos or backups, a fail-closed pre-push guard, EXIF/GPS stripping.",
  "Operate *hello-wattson* (hellowattson.ca), the public lesson site for 20 programs and 54 lessons, with a nightly GitHub Actions rebuild that keeps program dates current.",
  "Teach coding camps (Python, web, Arduino) and authored SPARK, the program's workshop-design framework.",
))

#entry-from(by-id("globalrelay"), bullets: (
  "Built a JSON response builder in Java to validate API responses, replacing manual response creation.",
  "Generated Java bindings from Thrift IDLs and integrated them with Wiremock containers for test stubs; implemented a single source of truth for regression tests using the Trino REST API.",
))

#entry-from(by-id("incognito"), bullets: (
  "Wrote automated GUI tests in Java and Selenium and maintained a regression test schedule.",
  "Set up a Docker and Jenkins continuous-testing environment.",
))

#section("Projects")
#for e in r.projects { entry-from(e) }

#section("Education")
#for e in r.education { entry-from(e) }
