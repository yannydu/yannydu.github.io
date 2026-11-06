// edit this file to change what the site says.
// kept separate from terminal.js so you don't have to touch logic
// to update your bio, projects, or links.
// resume text (name, role, contacts, skills) lives in resume/resume.json.

const content = {
  about: `Hey, I'm Danny. I build and run the content and software behind SFU's Science AL!VE.

What began as "someone should automate this" has evolved into a small platform: a publishing pipeline for projects campers build, a curriculum system that replaced our Word-document workflow (where activities were scattered across dozens of OneDrive folders with no way to distinguish drafts from actual teaching materials, and supply counts were manually tallied after writing), and the lesson site students follow in class. Students can now write and run code in the browser through Wattson's Playground (our fork of LiveCodes) and compile Arduino sketches without installing anything. Most of this runs on Cloudflare Workers. Because the users are children, a significant portion of the engineering focuses on privacy: keeping real names out of repositories, databases, and backups by design.

Much of this project was built with Claude Code, but the architecture, privacy model, and operations are all my own.

Type 'help' to look around.`,

  projects: [
    {
      name: "spark-gallery",
      description:
        "Every camp week becomes an issue of an online magazine, featuring games that campers build and that are playable directly in the browser, powered by Astro on Cloudflare Workers with D1 and R2. Real names are pseudonymized before any data touches the repository, and camper-written code is served from its own origin to ensure it can never access the gallery's cookies. It ran through a full summer of camps, and now takes fall club work too; instructors upload photos and projects from their phones after signing in with their SFU email.",
      facts: "13 camps · 509 projects from 471 campers",
      link: "https://sparkgallery.ca",
      page: "projects/spark-gallery.html",
      status: "live",
    },
    {
      name: "campkit",
      description:
        "Our curriculum platform is now in use by the program's curriculum writers. Activities are written once and assembled into camps like blocks, featuring a single canonical supply catalogue so that 'rubber bands' and 'elastic bands' will never again appear as two separate line items on a shopping list. Writers draft in a guided one-page lesson editor, instructors read lessons and track prep, and admins turn camps into shopping lists. Built with Hono + Drizzle on Cloudflare Workers with D1 and R2; staff sign in through Cloudflare Access. This is the successor to my previous Python + Typst pipeline (born from fighting Microsoft Word one too many times). It is internal only; no public link is available.",
      facts: "356 activities · 25 camps · 6 writers",
      link: null,
      page: "projects/campkit.html",
      status: "internal",
    },
    {
      name: "hello-wattson",
      description:
        "Started as the lesson site our own instructors used in class and is growing into a teaching platform: teachers anywhere browse a public catalogue and unlock modules with an access code, and the site stores nothing about students. 22 programs covering web development, Python, Arduino, LEGO robotics, and AI, all hosted by Wattson, our electrical mascot. This fall it added Pixel Club and Gadget Club, weekly clubs that open one session at a time, and an in-browser Arduino editor backed by a compile service (a Durable Object in front of a container) so students can build and flash sketches from a school laptop. Classroom access codes live in Workers KV with expiry, not in git. Astro on Cloudflare Workers, hand-written CSS, no client-side framework.",
      facts:
        "22 programs · 2 weekly clubs · hundreds of visits a month · hellowattson.ca",
      link: "https://hellowattson.ca",
      page: "projects/hello-wattson.html",
      status: "live",
    },
    {
      name: "wattsons-playground",
      description:
        "Our fork of LiveCodes, the open-source in-browser code playground, so students can run Python, turtle graphics, and web code from a lesson link with nothing to install. I added autosave for activity work, turtle autocomplete and error underlining, a light Wattson theme, and a first Python load about half as long. Deployed to Cloudflare Workers by GitHub Actions.",
      facts: "play.hellowattson.ca · linked from Pixel Club",
      link: "https://play.hellowattson.ca",
      page: null,
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
  updated: "2026-10-26",
};
