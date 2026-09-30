// edit this file to change what the site says.
// kept separate from terminal.js so you don't have to touch logic
// to update your bio, projects, or links.

const content = {
  name: "Danny Yu",
  title: "full-stack engineer · internal platforms for STEM education",

  about: `Hey, I'm Danny. I build and run the software behind a university
STEM outreach program, and I teach the camps it exists for.

What started as "someone should automate this" has turned into a
small platform: a publishing pipeline for the projects campers
build, a curriculum system that replaced our Word-document
workflow (activities used to sit in a dozen OneDrive folders with
no way to tell a draft from what we were actually teaching, and
supply counts were added up by hand after the writing was done),
and the lesson site kids follow in class, now with code they can
write and run right in the browser through livecodes. Most of it
runs on Cloudflare Workers. Because the users are children, a lot
of the engineering is privacy work: keeping real names out of
repos, databases, and backups by construction.

A lot of this is built using Claude Code. The architecture, privacy model,
and operations are mine.

Type 'help' to look around.`,

  projects: [
    {
      name: "spark-gallery",
      description:
        "Every camp week becomes an issue of an online magazine, and the games campers build are playable right in the browser. Astro on Cloudflare Workers, with D1 and R2 behind it. Real names are pseudonymized before anything touches the repo, and camper-written code is served from its own origin so it can never reach the gallery's cookies. Running through a full summer of camps so far.",
      facts: "13 camps · 509 projects from 416 campers · 0 worker errors",
      link: "https://sparkgallery.ca",
      page: "projects/spark-gallery.html",
      status: "live",
    },
    {
      name: "campkit",
      description:
        "Our curriculum platform, generation two, in use by the program's curriculum writers. Activities are written once and assembled into camps like blocks, with one canonical supply catalogue so 'rubber bands' and 'elastic bands' can never again become two shopping-list line items. Hono + Drizzle on Cloudflare Workers; staff sign in with the SFU Microsoft accounts they already have, through Cloudflare Access. Successor to my Python + Typst pipeline (the one born from fighting Google Docs one time too many). Internal, so no public link.",
      facts: "356 activities · 25 camps · 6 writers · 28-file Vitest suite",
      link: null,
      page: "projects/campkit.html",
      status: "internal",
      image: { src: "images/campkit.svg", alt: "campkit logo", width: 2000, height: 500 },
    },
    {
      name: "hello-wattson",
      description:
        "The public lesson site students follow in class: twenty programs and 54 lessons across web dev, Python, Arduino, LEGO robotics, and AI, hosted by Wattson, our electrical mascot. Astro on Cloudflare Workers, hand-written CSS, no client-side framework, and a nightly GitHub Actions rebuild so program dates stay accurate.",
      facts:
        "20 programs · 54 lessons · hundreds of visits a month · hellowattson.ca",
      link: "https://hellowattson.ca",
      page: "projects/hello-wattson.html",
      status: "live",
      image: { src: "images/hello-wattson.svg", alt: "hello-wattson logo", width: 2000, height: 650 },
    },
    {
      name: "ChessMate",
      description:
        "A smart automated chessboard, built as my SFU ENSC capstone. I built the human-move detection module with a Raspberry Pi camera and OpenCV, comparing board states to identify the moved piece, and drove an electromagnetic trolley in Python to execute the machine's moves.",
      facts: "SFU ENSC capstone · Jan. 2024 – Aug. 2024",
      link: null,
      page: null,
      status: "capstone",
    },
  ],

  skills: {
    "Daily drivers": [
      "Python",
      "JavaScript",
      "HTML / CSS",
      "Typst",
      "git",
      "linux",
    ],
    "Ship with (AI-assisted, still internalizing)": [
      "TypeScript",
      "Astro / Hono",
      "Cloudflare (Workers, D1, R2)",
      "Docker",
    ],
    "AI-assisted development": [
      "Claude Code as a daily tool, custom skills, hooks, and subagents",
      "taking a spec to a deployed system, and owning what ships",
    ],
    "Currently learning": [
      "turning AI-scaffolded breadth into first-hand depth, starting with TypeScript and SQL",
    ],
  },

  community: [
    {
      role: "SFU FAS Student Ambassador",
      dates: "Dec 2021 – Dec 2024",
      description:
        "mentored undergraduate engineering students and recruited prospective ones.",
    },
    {
      role: "SFU Computing Science Peer Tutor",
      dates: "Jan 2020 – Aug 2021",
      description:
        "helped undergrads untangle course material and problem solving.",
    },
  ],

  contact: {
    github: "https://github.com/yannydu",
    email: "danny_yu_2@sfu.ca",
  },

  // compiled from resume/dev.typ, see resume/template.typ
  resumePath: "resume/Danny_Yu_Resume.pdf",
  updated: "2026-09-18",
};
