// edit this file to change what the site says.
// kept separate from terminal.js so you don't have to touch logic
// to update your bio, projects, or links.
// resume text (name, role, contacts, skills) lives in resume/resume.json.

const content = {
  about: `Hey, I'm Danny. I build and run the content and software behind SFU's Science AL!VE.

What began as "someone should automate this" has evolved into a small platform: a publishing pipeline for projects campers build, a curriculum system that replaced our Word-document workflow (where activities were scattered across dozens of OneDrive folders with no way to distinguish drafts from actual teaching materials, and supply counts were manually tallied after writing), and the lesson site students follow in class. Now, they can write and run code directly in their browser through livecodes. Most of this runs on Cloudflare Workers. Because the users are children, a significant portion of the engineering focuses on privacy: keeping real names out of repositories, databases, and backups by design.

Much of this project was built with Claude Code, but the architecture, privacy model, and operations are all my own.

Type 'help' to look around.`,

  projects: [
    {
      name: "spark-gallery",
      description:
        "Every camp week becomes an issue of an online magazine, featuring games that campers build and that are playable directly in the browser, powered by Astro on Cloudflare Workers with D1 and R2. Real names are pseudonymized before any data touches the repository, and camper-written code is served from its own origin to ensure it can never access the gallery's cookies. This has been running through a full summer of camps so far.",
      facts: "13 camps · 509 projects from 416 campers",
      link: "https://sparkgallery.ca",
      page: "projects/spark-gallery.html",
      status: "live",
    },
    {
      name: "campkit",
      description:
        "Our curriculum platform is now in use by the program's curriculum writers. Activities are written once and assembled into camps like blocks, featuring a single canonical supply catalogue so that 'rubber bands' and 'elastic bands' will never again appear as two separate line items on a shopping list. Built with Hono + Drizzle on Cloudflare Workers, staff sign in using their existing SFU Microsoft accounts via Cloudflare Access. This is the successor to my previous Python + Typst pipeline (born from fighting Microsoft Word one too many times). It is internal only; no public link is available.",
      facts: "356 activities · 25 camps · 6 writers",
      link: null,
      page: "projects/campkit.html",
      status: "internal",
    },
    {
      name: "hello-wattson",
      description:
        "The public lesson site students follow in class features twenty programs and 54 lessons covering web development, Python, Arduino, LEGO robotics, and AI, all hosted by Wattson, our electrical mascot. The platform includes Astro on Cloudflare Workers, hand-written CSS, no client-side framework, and a nightly GitHub Actions rebuild to ensure program dates remain accurate.",
      facts:
        "20 programs · 54 lessons · hundreds of visits a month · hellowattson.ca",
      link: "https://hellowattson.ca",
      page: "projects/hello-wattson.html",
      status: "live",
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

  // compiled from resume/dev.typ, see resume/template.typ
  resumePath: "resume/Danny_Yu_Resume.pdf",
  updated: "2026-09-18",
};
