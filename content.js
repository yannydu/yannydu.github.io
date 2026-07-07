// edit this file to change what the site says.
// kept separate from terminal.js so you don't have to touch logic
// to update your bio, projects, or links.

const content = {
  name: "Danny Yu",
  title: "full-stack engineer · internal platforms for STEM education",

  about: `Hey — I'm Danny. I build and run the software behind a university
STEM outreach program, and I teach the camps it exists for.

What started as "someone should automate this" has turned into a
small platform: a publishing pipeline for the projects campers
build, a curriculum system that replaced our Word-document
workflow, and the lesson site kids follow in class. Most of it
runs on Cloudflare Workers. And because the users are children,
a lot of the real engineering is privacy work — keeping real
names out of repos, databases, and backups by construction.

Full disclosure: I build with Claude Code, heavily. The
architecture, the requirements, the privacy decisions, and the
operations are mine; much of the typing isn't. I think that's
where this job is going, and I'd rather be honest about it and
get good at it.

Type 'help' to look around.`,

  projects: [
    {
      name: "spark-gallery",
      description:
        "The last version of this site listed 'student-showcase-automation (wip)'. It shipped. Every camp week becomes an issue of an online magazine, and the games campers build are playable right in the browser. Astro on Cloudflare Workers, with D1 and R2 behind it. The part I care about most is invisible: real names are pseudonymized before anything touches the repo, and camper-written code is served from its own origin so it can never reach the gallery's cookies. Live now, holding a full summer of camps. Built with Claude Code; the design calls and the operations are mine.",
      link: "https://spark-gallery.saadmin4.workers.dev",
    },
    {
      name: "campkit",
      description:
        "Our curriculum platform, generation two. Activities are written once and assembled into camps like blocks, with one canonical supply catalogue so 'rubber bands' and 'elastic bands' can never again become two shopping-list line items. Hono + Drizzle on Cloudflare Workers; staff sign in with the university Microsoft accounts they already have. Successor to my Python + Typst pipeline (the one born from fighting Google Docs one time too many). Built with Claude Code. Internal, so no link yet.",
      link: "#",
    },
    {
      name: "hello-wattson",
      description:
        "The public lesson site students follow in class: fourteen programs across web dev, Python, Arduino, and LEGO robotics, hosted by Wattson, our electrical mascot. Eleventy on Cloudflare Pages, hand-written CSS, no client-side framework, and a small Workers cron that rebuilds the site every morning so program dates stay honest. Also built with Claude Code.",
      link: "#",
    },
  ],

  skills: {
    "Daily drivers": ["Python", "JavaScript", "HTML / CSS", "Typst", "git", "linux"],
    "Ship with (AI-assisted, still internalizing)": [
      "TypeScript",
      "Astro / Hono",
      "Cloudflare (Workers, Pages, D1, R2)",
      "Docker",
    ],
    "AI-assisted development": [
      "Claude Code as a daily tool — custom skills, hooks, and subagents",
      "taking a spec to a deployed system, and owning what ships",
    ],
    "Currently learning": [
      "turning AI-scaffolded breadth into first-hand depth — TypeScript and SQL first",
    ],
  },

  contact: {
    github: "https://github.com/yannydu",
    linkedin: "https://www.linkedin.com/in/REPLACE-ME",
    email: "danny_yu_2@sfu.ca",
  },

  // set to a real path (e.g. "/resume.pdf") once you drop a PDF in the repo
  resumePath: null,
};
