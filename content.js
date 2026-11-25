// edit this file to change what the site says.
// kept separate from terminal.js so you don't have to touch logic
// to update your bio, projects, or links.
// resume text (name, role, contacts, skills) lives in resume/resume.json.
// project fields: `asOf` (YYYY-MM-DD) dates the counts in `facts`; `impact`
// names an impact.json key that reader.js appends as a live figure.

const content = {
  about: `Hey, I'm Danny. I build and run the content and software behind SFU's Science AL!VE.

What began as "someone should automate this" has evolved into a small platform: a publishing pipeline for projects campers build, a curriculum system that replaced our Word-document workflow (where activities were scattered across dozens of OneDrive folders with no way to distinguish drafts from actual teaching materials, and supply counts were manually tallied after writing), and the lesson site students follow in class. Students can now write and run code in the browser through Wattson's Playground (our fork of LiveCodes) and compile Arduino sketches without installing anything. Most of this runs on Cloudflare Workers. Because the users are children, a significant portion of the engineering focuses on privacy: keeping real names out of repositories, databases, and backups by design.

Much of this was built with Claude Code; the architecture, privacy model, and operations are my decisions.

Type 'help' to look around.`,

  projects: [
    {
      name: "spark-gallery",
      description:
        "Every camp week produces photos, code projects, and videos, and children's real names cannot go online. Each week is now published as a magazine issue that families open from a link, with camper-built games playable in the browser and nicknames assigned before anything is uploaded.",
      facts: "47 camps · 471 campers · 497 projects published",
      asOf: "2026-11-24",
      link: "https://sparkgallery.ca",
      page: "projects/spark-gallery.html",
      status: "live",
    },
    {
      name: "campkit",
      description:
        "Camp curriculum lived in one large document per camp, with draft copies spread across shared folders and supply names typed by hand. Activities are now written once, assembled into camps, and costed into a shopping list from a single supply catalogue; it is internal, so there is no public link.",
      facts: "405 activities and lessons · 41 programs · 6 writers",
      asOf: "2026-11-02",
      link: null,
      page: "projects/campkit.html",
      status: "internal",
    },
    {
      name: "hello-wattson",
      description:
        "School laptops can't install coding tools, and a site that stores student data brings privacy paperwork before a teacher can use it. Teachers unlock lessons with a class code, students write and run code in the browser (Arduino sketches included), and the site stores nothing about classroom students.",
      facts: "22 programs · 2 weekly clubs · hellowattson.ca",
      impact: "lessons_served",
      link: "https://hellowattson.ca",
      page: "projects/hello-wattson.html",
      status: "live",
    },
    {
      name: "wattsons-playground",
      description:
        "Students needed to run Python, turtle graphics, and web code from a lesson link with nothing to install. This is our fork of LiveCodes, an open-source in-browser playground, with autosave for activity work, turtle autocomplete, and error underlining added.",
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
};
