#import "template.typ": *

#let r = json("resume.json")
#let by-id(id) = r.experience.find(e => e.id == id)

#show: resume.with(
  name: [Danny #text(weight: "bold")[Yu]],
  role: "QA · AI Applications",
  contacts: r.contacts.map(c => link(c.url, c.label)),
)

#section("Summary")
Computer Engineering graduate (SFU, 2025) who started and leads the internal
web platforms at SFU Science Alive, built by directing AI coding agents: I
define what each change must do, check each release against what staff need, and refine from user
feedback. I write the prompts and agent instructions that steer the model and
review its output against requirements. The platforms serve real users: 509 camper projects published in one
summer and a curriculum platform holding 356 activities and 25 camps for a
six-person staff team. Earlier: two QA and
test-automation co-ops.

#section("Skills")
#skills((
  (
    "Languages",
    "Python, JavaScript, HTML / CSS",
  ),
  (
    "LLM workflows",
    "prompt engineering (Claude Code skills, agent instructions, hooks), reviewing LLM output against requirements",
  ),
  (
    "Product leadership",
    "requirements and priorities, privacy rules for minors, user support, documentation",
  ),
))

#section("Work Experience")
#entry-from(by-id("sfu"), bullets: (
  "Started and lead the program's internal web platforms, built with Claude Code: I set the requirements and priorities, and check each release against what staff need.",
  "Designed the AI workflow behind the build: Claude Code skills that take a request from board item to merged change, hooks that block risky actions, and specialized agents for building, review, and QA. Analyzed 365 AI-agent runs to find what drove cost and turn count, then changed brief limits and model settings from the results.",
  "Launched *spark-gallery*, an online magazine of camper projects published each camp week: 509 projects from 471 campers through a full summer of camps.",
  "Introduced *campkit*, a shared curriculum platform that replaced my earlier document pipeline, holding 356 activities and 25 camps for a six-person staff team.",
  "Set privacy rules for products used by children: camper names become pseudonyms before anything is stored, and camper code runs apart from the main site.",
  "Keep refining the platforms from feedback: triage problems reported by writers and instructors into tracked issues, document them, and decide what ships next.",
  "Wrote SPARK, the program's 22-page workshop-design framework; teach coding camps (Python, web, Arduino, LEGO robotics).",
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
