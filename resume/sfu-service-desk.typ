// SFU Surrey IT Services, Client Services: Service Desk Agent (CUPE 3338, grade 9)
// cover letter + resume in one PDF, same layout as sfu-ams.typ
// compile: typst compile --pdf-standard ua-1 sfu-service-desk.typ Danny_Yu_SFU_Service_Desk_Application.pdf
#import "template.typ": *

#let r = json("resume.json")
#let by-id(id) = r.experience.find(e => e.id == id)
#let name = [Danny #text(weight: "bold")[Yu]]
#let role = "Technical Support · Troubleshooting, Classroom Technology & Systems"
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
Client Services, Surrey IT Services \
Simon Fraser University

*Re: Service Desk Agent, Surrey IT Services*

Dear Hiring Committee,

I'm applying for the Service Desk Agent position at the Surrey campus. For
the past five years I have worked inside an SFU faculty unit, Science Alive
in the Faculty of Applied Sciences. My role there is to keep teaching
technology working for the people who rely on it: instructors running a
room, curriculum writers, and the students and families on the other end. A
service desk is the same work for the whole campus, and I'd like to do it on
your team.

Most of my troubleshooting happens in classrooms. A camp or school workshop
is thirty devices sharing one network connection, often on slow wifi, with
an instructor who needs it working in the next five minutes. I teach in
those rooms (Python, web development, Arduino, LEGO robotics), so I have
diagnosed hardware, software, and connectivity problems live, in front of a
class. When something breaks, I work through it methodically: reproduce
it, narrow it down, fix it, then write it down so the next person doesn't
hit it.

I also support the staff who use the systems I run. Six curriculum writers
sign in with their SFU accounts to *campkit*, the curriculum platform I
built, and camp instructors publish student work through *spark-gallery*,
which handled 509 projects from 416 campers over the summer. Most of these
users are not technical, so I design the steps around them: a link and a
printed instruction sheet instead of software to install. When they get
stuck, I'm the person they contact, and I explain the fix in plain language.
After camp I write to parents directly, sending each family their child's
code and programs with step-by-step instructions for running them and
continuing the work at home.

My Computer Engineering degree and two co-ops give me the technical base.
As a developer in test at Global Relay and a QA intern at Incognito
Software, my job was to find out exactly why something failed and report it
clearly. I also set up a Docker and Jenkins testing environment, so I'm
comfortable with servers, configuration, and logs.

I want to be direct about the gaps. I have not worked a ticketed service
desk, and I have not maintained lecture-theatre audio-visual systems. The
habits carry over: triage by impact, keep clear notes on every case, and
follow up until it's resolved. I learn new systems quickly, and I would
learn your tools and procedures the same way.

Because my users are children, privacy is designed in from the start: real
names never reach repositories, databases, or backups. I would bring that
same care to student, faculty, and staff accounts. Thank you for your
consideration. I would welcome the chance to talk about the role.

Sincerely, \
Danny Yu

#pagebreak()

// ---------- resume ----------
#set par(leading: 0.5em, spacing: 1.2em)
#set text(size: 10pt)
#header(name, role, contacts)

#section("Summary")
Technical support and systems person with an SFU Computer Engineering
degree, two QA and test-automation co-ops, and five years in an SFU faculty
unit. I keep classroom technology working for instructors and students, and
I run and support the web systems our staff use, including a curriculum
platform behind SFU sign-in. Methodical troubleshooter, clear communicator
with non-technical users. I build with Claude Code and make the
architecture, data, privacy, and operations decisions myself.

#section("Skills")
#skills((
  (
    "Troubleshooting",
    "Classroom devices and networks, hardware (Arduino, LEGO SPIKE, Raspberry Pi), user accounts and sign-in, web applications",
  ),
  ("Systems & tools", "Linux, git, Docker, Jenkins, GitHub Actions, Cloudflare, SQL (SQLite / D1)"),
  ("Languages", "Python, JavaScript, HTML / CSS, Java"),
  ("Support", "Plain-language instructions and documentation, staff onboarding, testing and bug reporting"),
))

#section("Work Experience")
#entry-from(by-id("sfu"), bullets: (
  "Teach coding and robotics camps and school workshops (Python, web, Arduino, LEGO robotics), keeping a room of student devices working on shared, often slow, school networks.",
  "Support the program's staff on the systems I run: six curriculum writers on *campkit* (SFU sign-in via Cloudflare Access), and camp instructors publishing through *spark-gallery* (509 projects from 416 campers over one summer).",
  "Designed workflows for non-technical users: uploads from the camp room through a link and a printed instruction sheet, with no software to install.",
  "Communicate directly with parents: send each family their child's code and programs with written, step-by-step instructions for running them and continuing at home.",
  "Operate *hello-wattson* (hellowattson.ca), the public lesson site for 20 programs and 54 lessons that students use on classroom devices, with a nightly automated rebuild that keeps program dates current.",
  "Protect personal data by design: student names pseudonymized before reaching repos or backups, and location data stripped from photos and video.",
  "Authored SPARK, the program's workshop-design framework.",
))

#entry-from(by-id("globalrelay"), bullets: (
  "Diagnosed API failures by building a Java tool that validates service responses against expected results.",
  "Built test stubs (Thrift, Wiremock) and a single source of truth for regression tests using the Trino REST API.",
))

#entry-from(by-id("incognito"), bullets: (
  "Wrote automated GUI tests in Java and Selenium and maintained a regression test schedule.",
  "Set up a Docker and Jenkins continuous-testing environment.",
))

#section("Projects")
#for e in r.projects { entry-from(e) }

#section("Education")
#for e in r.education { entry-from(e) }
