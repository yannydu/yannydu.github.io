// terminal.js — command loop, history, autocomplete, boot sequence.
// depends on content.js (window.content) and themes.js (window.themes, applyTheme).

// ---------- helpers ----------
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

const output = document.getElementById("output");
const srLog = document.getElementById("sr-log");
const input = document.getElementById("cmd-input");
const form = document.getElementById("prompt-form");

function write(html, cls) {
  const div = document.createElement("div");
  div.className = "entry" + (cls ? " " + cls : "");
  div.innerHTML = html;
  output.appendChild(div);
  // mirror to the aria-live log immediately, so screen readers get each
  // response once in full even while the visual copy is still typing out
  const sr = document.createElement("div");
  sr.textContent = div.textContent;
  srLog.appendChild(sr);
  window.scrollTo(0, document.body.scrollHeight);
  return div;
}

// ---------- typewriter ----------
let finishTyping = null; // non-null while an animation is in flight

function typewrite(el) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (finishTyping) finishTyping();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push([n, n.data]);
  if (!nodes.length) return;
  nodes.forEach(([node]) => (node.data = ""));

  let i = 0;
  let pos = 0;
  let raf = 0;
  // 4 chars/frame minimum, scaled up so even big outputs (neofetch art,
  // projects) finish within ~2.5s at 60fps
  const total = nodes.reduce((sum, [, text]) => sum + text.length, 0);
  const CHARS_PER_TICK = Math.max(4, Math.ceil(total / 150));

  function finish() {
    cancelAnimationFrame(raf);
    for (; i < nodes.length; i++) nodes[i][0].data = nodes[i][1];
    finishTyping = null;
    document.removeEventListener("keydown", finish, true);
    document.removeEventListener("click", finish, true);
    window.scrollTo(0, document.body.scrollHeight);
  }

  function tick() {
    let budget = CHARS_PER_TICK;
    while (budget > 0 && i < nodes.length) {
      const [node, text] = nodes[i];
      const take = Math.min(budget, text.length - pos);
      pos += take;
      budget -= take;
      node.data = text.slice(0, pos);
      if (pos >= text.length) {
        i++;
        pos = 0;
      }
    }
    window.scrollTo(0, document.body.scrollHeight);
    if (i < nodes.length) raf = requestAnimationFrame(tick);
    else finish();
  }

  finishTyping = finish;
  // any keypress or click skips to the end
  document.addEventListener("keydown", finish, true);
  document.addEventListener("click", finish, true);
  raf = requestAnimationFrame(tick);
}

// ---------- ASCII banner ----------
const BANNER = [
  " ____                             __   __",
  "|  _ \\  __ _ _ __  _ __  _   _    \\ \\ / /   _",
  "| | | |/ _` | '_ \\| '_ \\| | | |    \\ V / | | |",
  "| |_| | (_| | | | | | | | |_| |     | || |_| |",
  "|____/ \\__,_|_| |_|_| |_|\\__, |     |_| \\__,_|",
  "                         |___/",
].join("\n");

// ---------- ASCII portrait ----------
// pregenerated from profile.png (scripts kept out of the repo);
// every line is exactly 40 visible columns so neofetch can pad against it
const ART_LINES = [
  '                  <span class="art-y">+</span>   <span class="art-y">++</span>                ',
  '              <span class="art-y">++</span><span class="art-f">@@@@@@@@@@</span><span class="art-y">+++</span>           ',
  '           <span class="art-y">+</span><span class="art-f">@@@@@@@@@@@@@@@@@</span><span class="art-y">++</span>         ',
  '         <span class="art-y">+</span><span class="art-f">@@@@@@@@@@@@@@@@@@@@@@</span>        ',
  '       <span class="art-y">++</span><span class="art-f">@@@@@@@@@@@@@@@@@@@@@@@</span><span class="art-y">+</span><span class="art-f">@</span><span class="art-y">+</span>     ',
  '     <span class="art-y">+</span><span class="art-f">@@@@@@@@@@@@</span><span class="art-y">++</span><span class="art-f">@@</span><span class="art-y">+</span><span class="art-f">@</span><span class="art-y">+</span><span class="art-f">@@@@@@@@@</span><span class="art-y">++</span>    ',
  '     <span class="art-f">@@@@@@@@</span><span class="art-y">+</span><span class="art-f">@</span><span class="art-y">++++++++</span><span class="art-f">@@@@@@@@@@@@</span><span class="art-y">+</span>    ',
  '   <span class="art-y">+</span><span class="art-f">@@@@@@@</span><span class="art-y">+++++</span><span class="art-f">@</span><span class="art-y">++++</span><span class="art-f">@@</span><span class="art-y">++++</span><span class="art-f">@@@@@@@@@</span><span class="art-y">+</span>   ',
  '   <span class="art-y">+</span><span class="art-f">@@@@@@@</span><span class="art-y">+++++</span><span class="art-f">@@@@@@</span><span class="art-y">++++++</span><span class="art-f">@@@@@@@@</span><span class="art-y">+</span>   ',
  '   <span class="art-f">@@@@@@</span><span class="art-y">+</span><span class="art-f">@</span><span class="art-y">+</span><span class="art-f">@@</span><span class="art-y">+</span><span class="art-f">@</span><span class="art-y">++++++</span><span class="art-f">@@</span><span class="art-y">++</span><span class="art-f">@@</span><span class="art-y">++</span><span class="art-f">@@@@@@@</span>   ',
  '   <span class="art-f">@@@@@</span><span class="art-y">+++++++++++++++++++++++</span><span class="art-f">@@@@@@</span>   ',
  '   <span class="art-y">+</span><span class="art-f">@@@</span><span class="art-y">+++++++++++++++++++++++++</span><span class="art-f">@@@@@</span>   ',
  '    <span class="art-f">@@@@</span><span class="art-y">+++++++++++++++++++++++</span><span class="art-f">@@@@@</span>    ',
  '     <span class="art-f">@@@@</span><span class="art-y">+++++++++++++</span><span class="art-f">@</span><span class="art-y">+++++++</span><span class="art-f">@@@@@@</span>    ',
  '       <span class="art-f">@@@</span><span class="art-y">++++</span><span class="art-f">@@@@@@@@@</span><span class="art-y">++++++</span><span class="art-f">@@</span><span class="art-y">+</span><span class="art-f">@</span>       ',
  '         <span class="art-y">+</span><span class="art-f">@</span><span class="art-y">+++++</span><span class="art-f">@@@@@</span><span class="art-y">++++++</span><span class="art-f">@@</span>           ',
  '          <span class="art-y">+</span><span class="art-f">@</span><span class="art-y">++++++++++++</span><span class="art-f">@@</span>              ',
  '            <span class="art-y">++++++++++++</span>                ',
  '               <span class="art-y">+++++</span>                    ',
];

// ---------- command registry ----------
const SECTIONS = ["about", "projects", "skills", "community", "contact", "resume"];

function currentThemeId() {
  try {
    return localStorage.getItem("theme") || "kanagawa";
  } catch (_) {
    return "kanagawa";
  }
}

const commands = {
  help() {
    return [
      "available commands:",
      '  <span class="ok">about</span>         — who I am',
      '  <span class="ok">projects</span>      — things I\'ve built',
      '  <span class="ok">skills</span>        — languages & tools',
      '  <span class="ok">community</span>     — mentoring & volunteering',
      '  <span class="ok">contact</span>       — how to reach me',
      '  <span class="ok">resume</span>        — my resume',
      '  <span class="ok">theme</span> [name]  — change color theme (try: theme list)',
      '  <span class="ok">neofetch</span>      — system info, terminal-nerd style',
      '  <span class="ok">crt</span>           — toggle retro CRT mode',
      '  <span class="ok">banner</span>        — show the ASCII banner',
      '  <span class="ok">ls</span>            — list sections',
      '  <span class="ok">cat</span> &lt;section&gt; — show a section (e.g. cat about)',
      '  <span class="ok">open</span> &lt;site&gt;    — opens github / linkedin / email',
      '  <span class="ok">whoami</span>        — a quiet existential moment',
      '  <span class="ok">echo</span> &lt;text&gt;    — repeat after me',
      '  <span class="ok">clear</span>         — clear the screen (or Ctrl+L)',
      '  <span class="ok">help</span>          — this menu',
      "",
      "tips: ↑/↓ for history, Tab for autocomplete.",
    ].join("\n");
  },

  about() {
    return escapeHtml(content.about);
  },

  projects() {
    return content.projects
      .map((p) => {
        const link = escapeHtml(p.link);
        return (
          `<h3>${escapeHtml(p.name)}</h3>` +
          `${escapeHtml(p.description)}\n` +
          `  <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`
        );
      })
      .join("\n\n");
  },

  skills() {
    return Object.entries(content.skills)
      .map(
        ([cat, items]) =>
          `<h3>${escapeHtml(cat)}</h3>` +
          items.map((i) => `  • ${escapeHtml(i)}`).join("\n"),
      )
      .join("\n\n");
  },

  community() {
    return content.community
      .map(
        (c) =>
          `<h3>${escapeHtml(c.role)} (${escapeHtml(c.dates)})</h3>` +
          `  ${escapeHtml(c.description)}`,
      )
      .join("\n\n");
  },

  contact() {
    const c = content.contact;
    return [
      `  github    <a href="${escapeHtml(c.github)}"   target="_blank" rel="noopener noreferrer">${escapeHtml(c.github)}</a>`,
      `  linkedin  <a href="${escapeHtml(c.linkedin)}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.linkedin)}</a>`,
      `  email     <a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a>`,
    ].join("\n");
  },

  resume() {
    if (content.resumePath) {
      const p = escapeHtml(content.resumePath);
      return `<a href="${p}" target="_blank" rel="noopener noreferrer">open resume (${p})</a>`;
    }
    return "resume coming soon — drop a PDF in the repo and set `resumePath` in content.js.";
  },

  theme(args) {
    const arg = args[0];
    const current = currentThemeId();
    if (!arg || arg === "list") {
      const lines = Object.entries(themes).map(([id, t]) => {
        const marker = id === current ? "•" : " ";
        return `  ${marker} ${id.padEnd(10)} ${escapeHtml(t.name)}`;
      });
      return (
        "available themes:\n" + lines.join("\n") + "\n\nusage: theme <name>"
      );
    }
    if (applyTheme(arg))
      return `theme set to <span class="ok">${escapeHtml(themes[arg].name)}</span>.`;
    return { err: `unknown theme: ${escapeHtml(arg)}. try 'theme list'.` };
  },

  banner() {
    return `<pre class="banner">${escapeHtml(BANNER)}</pre>`;
  },

  neofetch() {
    const row = (k, v) => `<span class="ok">${k.padEnd(8)}</span> ${v}`;
    const swatch = ["red", "orange", "yellow", "green", "blue", "purple"]
      .map((c) => `<span style="color: var(--${c})">███</span>`)
      .join("");
    const info = [
      '<span class="ok">danny</span>@<span class="ok">portfolio</span>',
      "---------------",
      row("OS", "DannyOS 1.0 LTS"),
      row("Host", "SFU Science Alive"),
      row("Shell", "bash (human)"),
      row("Uptime", "20-something years"),
      row("Editor", "Claude Code"),
      row("Theme", escapeHtml(themes[currentThemeId()].name)),
      row("Hobbies", "climbing, running"),
      "",
      swatch,
    ];
    const blank = " ".repeat(40); // ART_LINES are 40 visible cols each
    const rows = Math.max(ART_LINES.length, info.length);
    const lines = [];
    for (let r = 0; r < rows; r++) {
      lines.push((ART_LINES[r] || blank) + "   " + (info[r] || ""));
    }
    return `<pre class="neofetch">${lines.join("\n")}</pre>`;
  },

  crt() {
    const on = document.documentElement.classList.toggle("crt");
    try {
      localStorage.setItem("crt", on ? "1" : "");
    } catch (_) {}
    return on
      ? 'CRT mode <span class="ok">on</span> — hello, 1985.'
      : "CRT mode off.";
  },

  ls() {
    return SECTIONS.join("  ");
  },

  cat(args) {
    const section = args[0];
    if (!section) return { err: "cat: missing operand. try: cat about" };
    if (SECTIONS.includes(section)) return commands[section]([]);
    return { err: `cat: ${escapeHtml(section)}: no such section` };
  },

  whoami() {
    return "you are a visitor. I am Danny. we are both, statistically, mostly water.";
  },

  echo(args) {
    return escapeHtml(args.join(" "));
  },

  open(args) {
    const target = args[0];
    const c = content.contact;
    const urls = {
      github: c.github,
      linkedin: c.linkedin,
      email: "mailto:" + c.email,
    };
    if (!urls[target]) {
      return {
        err: `open: unknown target '${escapeHtml(target || "")}'. try: github, linkedin, email`,
      };
    }
    window.open(
      urls[target],
      target === "email" ? "_self" : "_blank",
      "noopener,noreferrer",
    );
    return `opening ${escapeHtml(target)}...`;
  },

  clear() {
    output.innerHTML = "";
    srLog.innerHTML = "";
    return "";
  },

  sudo() {
    return { err: "nice try. permission denied — but I admire the ambition." };
  },

  exit() {
    return "you can check out any time you like, but you can never leave.";
  },
};

// aliases
commands["?"] = commands.help;
commands["man"] = commands.help;
commands["pfp"] = commands.neofetch;

// ---------- dispatch ----------
const cmdHistory = [];
let historyIdx = -1;
let draft = "";

function echoPrompt(line) {
  write(
    `<span class="prompt-echo">danny@portfolio:~$</span> ` +
      `<span class="cmd-echo">${escapeHtml(line)}</span>`,
  );
}

function dispatch(line) {
  const trimmed = line.trim();
  echoPrompt(trimmed);
  if (!trimmed) return;
  if (cmdHistory[0] !== trimmed) cmdHistory.unshift(trimmed);
  historyIdx = -1;

  const [cmd, ...args] = trimmed.split(/\s+/);
  const fn = commands[cmd];
  if (!fn) {
    write(
      `command not found: <span class="error">${escapeHtml(cmd)}</span>. type 'help'.`,
      "error",
    );
    return;
  }
  const result = fn(args);
  if (result && typeof result === "object" && "err" in result) {
    typewrite(write(result.err, "error"));
  } else if (result) {
    typewrite(write(result));
  }
}

// ---------- input handling ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = input.value;
  input.value = "";
  dispatch(v);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIdx === -1) draft = input.value;
    if (historyIdx < cmdHistory.length - 1) {
      historyIdx++;
      input.value = cmdHistory[historyIdx];
      moveCursorToEnd();
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIdx > 0) {
      historyIdx--;
      input.value = cmdHistory[historyIdx];
    } else if (historyIdx === 0) {
      historyIdx = -1;
      input.value = draft;
    }
    moveCursorToEnd();
  } else if (e.key === "Tab") {
    e.preventDefault();
    autocomplete();
  } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
    e.preventDefault();
    output.innerHTML = "";
    srLog.innerHTML = "";
  } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
    e.preventDefault();
    echoPrompt(input.value + "^C");
    input.value = "";
    historyIdx = -1;
  } else if (e.key === "Escape") {
    input.value = "";
    historyIdx = -1;
  }
});

function moveCursorToEnd() {
  setTimeout(
    () => input.setSelectionRange(input.value.length, input.value.length),
    0,
  );
}

function autocomplete() {
  const v = input.value;
  const parts = v.split(/\s+/);

  // complete first token = command name
  if (parts.length === 1) {
    const matches = Object.keys(commands).filter(
      (n) => n.startsWith(parts[0]) && !["?", "man"].includes(n),
    );
    if (matches.length === 1) input.value = matches[0] + " ";
    else if (matches.length > 1) write(matches.join("  "));
    return;
  }

  // context-aware second-token completion
  const [cmd, arg = ""] = parts;
  let pool = null;
  if (cmd === "cat") pool = SECTIONS;
  if (cmd === "theme") pool = Object.keys(themes);
  if (cmd === "open") pool = ["github", "linkedin", "email"];

  if (pool) {
    const matches = pool.filter((n) => n.startsWith(arg));
    if (matches.length === 1) input.value = `${cmd} ${matches[0]}`;
    else if (matches.length > 1) write(matches.join("  "));
  }
}

// ---------- block caret ----------
const caret = document.createElement("span");
caret.className = "block-caret";
caret.setAttribute("aria-hidden", "true");
form.appendChild(caret);

let charWidth = 0;
function measureCharWidth() {
  const probe = document.createElement("span");
  probe.textContent = "M";
  const cs = getComputedStyle(input);
  probe.style.font = cs.font;
  probe.style.letterSpacing = cs.letterSpacing;
  probe.style.visibility = "hidden";
  probe.style.position = "absolute";
  probe.style.whiteSpace = "pre";
  document.body.appendChild(probe);
  charWidth = probe.getBoundingClientRect().width;
  probe.remove();
}

function updateCaret() {
  if (!charWidth) measureCharWidth();
  const pos = input.selectionStart ?? input.value.length;
  const inputRect = input.getBoundingClientRect();
  const formRect = form.getBoundingClientRect();
  const x = inputRect.left - formRect.left + pos * charWidth - input.scrollLeft;
  caret.style.left = x + "px";
  caret.style.top = inputRect.top - formRect.top + "px";
  caret.style.height = inputRect.height + "px";
  caret.style.width = charWidth + "px";
}

["input", "keydown", "keyup", "click", "focus", "blur", "select"].forEach(
  (ev) => input.addEventListener(ev, () => setTimeout(updateCaret, 0)),
);
window.addEventListener("resize", () => {
  measureCharWidth();
  updateCaret();
});
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    measureCharWidth();
    updateCaret();
  });
}

// keep focus on the input unless user is clicking a link / button / skip-link
document.addEventListener("click", (e) => {
  if (e.target.closest("a, button, .skip-link")) return;
  const sv = document.getElementById("standard-view");
  if (sv && !sv.hidden) return;
  input.focus();
});

// ---------- standard-view toggle ----------
const terminalView = document.getElementById("terminal-view");
const standardView = document.getElementById("standard-view");
const skipLink = document.getElementById("skip-link");

function showStandardView() {
  terminalView.hidden = true;
  standardView.hidden = false;
  populateStandardView();
  const h1 = standardView.querySelector("h1");
  h1.focus();
}
function showTerminalView() {
  standardView.hidden = true;
  terminalView.hidden = false;
  input.focus();
}
skipLink.addEventListener("click", (e) => {
  e.preventDefault();
  showStandardView();
});
document
  .getElementById("back-to-terminal")
  .addEventListener("click", showTerminalView);

let standardViewPopulated = false;
function populateStandardView() {
  if (standardViewPopulated) return;
  standardViewPopulated = true;

  standardView.querySelector("[data-name]").textContent = content.name;
  standardView.querySelector("[data-title]").textContent = content.title;
  standardView.querySelector("[data-about]").textContent = content.about;

  const projectsEl = standardView.querySelector("[data-projects]");
  content.projects.forEach((p) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = p.name;
    li.append(strong, " — " + p.description + " ");
    if (p.link && p.link !== "#") {
      const a = document.createElement("a");
      a.href = p.link;
      a.textContent = p.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);
    }
    projectsEl.appendChild(li);
  });

  const skillsEl = standardView.querySelector("[data-skills]");
  Object.entries(content.skills).forEach(([cat, items]) => {
    const dt = document.createElement("dt");
    dt.textContent = cat;
    const dd = document.createElement("dd");
    dd.textContent = items.join(", ");
    skillsEl.append(dt, dd);
  });

  const contactEl = standardView.querySelector("[data-contact]");
  const c = content.contact;
  const links = [
    { label: "GitHub", href: c.github },
    { label: "LinkedIn", href: c.linkedin },
    { label: "Email", href: "mailto:" + c.email, display: c.email },
  ];
  links.forEach((l) => {
    const li = document.createElement("li");
    li.append(l.label + ": ");
    const a = document.createElement("a");
    a.href = l.href;
    a.textContent = l.display || l.href;
    if (!l.href.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    li.appendChild(a);
    contactEl.appendChild(li);
  });
}

// ---------- boot sequence ----------
const bootLines = [
  { t: 90, text: "[  OK  ] Mounting /home/danny" },
  { t: 160, text: "[  OK  ] Calibrating personality matrices" },
  {
    t: 160,
    text: "[  OK  ] attention-to-detail.service — strict mode enabled",
  },
  { t: 160, text: "[  OK  ] continuous-learning.daemon — always-on" },
  { t: 180, text: "[  OK  ] Mounting climbing.fs, running.fs" },
  {
    t: 220,
    text: "[ WARN ] knees.daemon below threshold (user approaching 30) — stretching",
    cls: "warn",
  },
  {
    t: 240,
    text: "[ FAIL ] impostor-syndrome.service — masking, moving on",
    cls: "error",
  },
  {
    t: 180,
    text: "[  OK  ] /curriculum online — classroom.sock listening on :8080",
  },
  { t: 200, text: "[  OK  ] Portfolio listening on :80" },
  { t: 150, text: "" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function boot() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    for (const line of bootLines) {
      await sleep(line.t);
      write(escapeHtml(line.text), (line.cls || "ok") + " boot-line");
    }
  }
  write(`<pre class="banner">${escapeHtml(BANNER)}</pre>`);
  write(
    `<span style="color: var(--accent)">${escapeHtml(content.name)}</span> — ` +
      `<span style="color: var(--muted)">${escapeHtml(content.title)}</span>`,
  );
  write("");
  write(
    `type <span class="ok">help</span> to see commands, ` +
      `or <span class="ok">about</span> to start. ` +
      `screen-reader users: <a href="#standard-view" id="sr-hint-link">switch to standard view</a>.`,
  );
  write("");
  // wire the inline "switch to standard view" link we just rendered
  const inlineLink = document.getElementById("sr-hint-link");
  if (inlineLink)
    inlineLink.addEventListener("click", (e) => {
      e.preventDefault();
      showStandardView();
    });
  input.focus();
}

// ---------- init ----------
(function init() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved && themes[saved]) applyTheme(saved);
    if (localStorage.getItem("crt"))
      document.documentElement.classList.add("crt");
  } catch (_) {
    /* private mode, ignore */
  }
  boot();
})();
