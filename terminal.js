// terminal.js - command loop, history, autocomplete, boot sequence.
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

// srText: what screen readers hear. undefined = the entry's own text,
// "" = nothing. Each mirrored write replaces the older log children, so the
// page doesn't hold every answer twice.
function write(html, cls, srText) {
  const div = document.createElement("div");
  div.className = "term-line" + (cls ? " " + cls : "");
  div.innerHTML = html;
  output.appendChild(div);
  const text = srText === undefined ? div.textContent : srText;
  if (text) {
    const sr = document.createElement("div");
    sr.textContent = text;
    srLog.replaceChildren(sr);
  }
  window.scrollTo(0, document.body.scrollHeight);
  return div;
}

// plain text of an HTML string
function textOf(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent;
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
// pregenerated from the SFU Science Alive Wattson mascot (scripts kept out of the repo);
// every line is exactly 40 visible columns so neofetch can pad against it
const ART_LINES = [
  '           <span class="art-f">@@@@@@@@@@@@@@@@@@</span>           ',
  '       <span class="art-f">@@@@</span><span class="art-y">++++++++++++++++++</span><span class="art-f">@@@@</span>       ',
  '     <span class="art-f">@@</span><span class="art-y">+++++++++++++++++++++++++</span><span class="art-f">@@@</span>     ',
  '    <span class="art-f">@</span><span class="art-y">+++++++++++++++++++++++++++++</span><span class="art-f">@@</span>    ',
  '   <span class="art-f">@@</span><span class="art-y">++++++++++++++++++</span><span class="art-f">@@</span><span class="art-y">++++++++++</span><span class="art-f">@</span>    ',
  '    <span class="art-f">@</span><span class="art-y">++++++++</span><span class="art-f">@@@</span><span class="art-y">+++++++</span><span class="art-f">@@</span><span class="art-y">++++++++++</span><span class="art-f">@</span>    ',
  '<span class="art-f">@@@</span> <span class="art-f">@@</span><span class="art-y">++++++</span><span class="art-f">@</span><span class="art-y">+++++++++++++</span><span class="art-f">@</span><span class="art-y">+++++++</span><span class="art-f">@@</span>  <span class="art-f">@</span> ',
  '<span class="art-f">@@@</span>   <span class="art-f">@@</span><span class="art-y">+++</span><span class="art-f">@@@@@@@@@@@@@@@@@</span><span class="art-y">+++++</span><span class="art-f">@@</span> <span class="art-f">@@@@</span>',
  '   <span class="art-f">@@</span>  <span class="art-f">@@</span><span class="art-y">+++++++++++++++++++++</span><span class="art-f">@@@</span> <span class="art-f">@@</span>    ',
  '     <span class="art-f">@@@@@@</span><span class="art-y">+++++</span><span class="art-f">@@@@@@@</span><span class="art-y">+++++</span><span class="art-f">@@@@@@</span>      ',
  '          <span class="art-f">@@@</span><span class="art-y">+++</span><span class="art-f">@@@@@@@@</span><span class="art-y">+++</span><span class="art-f">@@@</span>          ',
  '           <span class="art-f">@@</span><span class="art-y">+++</span><span class="art-f">@@@@@@@</span><span class="art-y">++++</span><span class="art-f">@@</span>           ',
  '            <span class="art-f">@@@@@@@@@@@@@@@@</span>            ',
  '             <span class="art-f">@@@@@@@@@@@@@@</span>             ',
  '             <span class="art-f">@@@@@@@@@@@@@@</span>             ',
  '             <span class="art-f">@@@@@@@@@@@@@@</span>             ',
  '              <span class="art-f">@</span>         <span class="art-f">@</span>               ',
  '           <span class="art-f">@@@@</span>         <span class="art-f">@@@@@</span>           ',
];

// ---------- command registry ----------
const SECTIONS = [
  "about",
  "projects",
  "skills",
  "community",
  "contact",
  "resume",
];

function currentThemeId() {
  try {
    return localStorage.getItem("theme") || "auto";
  } catch (_) {
    return "auto";
  }
}
const hasTheme = (id) => Object.prototype.hasOwnProperty.call(themes, id);
function themeName(id) {
  if (id === "auto") {
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    return "auto (" + (dark ? "Mocha" : "Latte") + ")";
  }
  return hasTheme(id) ? themes[id].name : id;
}

// resume/resume.json is fetched once at boot. Typst markup in its strings:
// *x* is bold, `x` is code, backslashes are escapes.
let resumeData = null;
const resumeP = fetch("resume/resume.json")
  .then((r) => (r.ok ? r.json() : null))
  .catch(() => null)
  .then((d) => (resumeData = d));
function typst(str) {
  return escapeHtml(String(str).replace(/\\/g, ""))
    .replace(/\*([^*]+)\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
const noResume = (cmd) => ({ err: `${cmd}: resume data didn't load.` });

// impact.json is fetched once at boot; `impact` only advertises itself in
// help once a few weeks of event data exist (see scripts/impact-summary.py).
const IMPACT_MIN_WEEKS = 4;
let impactData = null;
function impactReady() {
  return (
    !!impactData && (impactData.event_weeks_logged || 0) >= IMPACT_MIN_WEEKS
  );
}

const commands = {
  __proto__: null, // ?run= comes from a link: commands["constructor"] must not resolve to Object
  help() {
    return [
      "available commands:",
      '  <span class="ok">about</span>         - who I am',
      '  <span class="ok">projects</span>      - things I\'ve built',
      '  <span class="ok">skills</span>        - languages & tools',
      '  <span class="ok">community</span>     - mentoring & volunteering',
      '  <span class="ok">contact</span>       - how to reach me',
      '  <span class="ok">resume</span>        - my resume',
      '  <span class="ok">theme</span> [name]  - change color theme (try: theme list)',
      '  <span class="ok">neofetch</span>      - system info, terminal-nerd style',
      ...(impactReady()
        ? ['  <span class="ok">impact</span>        - platform usage figures']
        : []),
      '  <span class="ok">crt</span>           - toggle retro CRT mode',
      '  <span class="ok">banner</span>        - show the ASCII banner',
      '  <span class="ok">ls</span>            - list sections',
      '  <span class="ok">cat</span> &lt;section&gt; - show a section (e.g. cat about)',
      '  <span class="ok">read</span> &lt;project&gt; - deep dive on a project, right here (e.g. read spark-gallery)',
      '  <span class="ok">open</span> &lt;target&gt;  - github / email / a project page (e.g. open spark-gallery)',
      '  <span class="ok">whoami</span>        - a quiet existential moment',
      '  <span class="ok">echo</span> &lt;text&gt;    - repeat after me',
      '  <span class="ok">clear</span>         - clear the screen (or Ctrl+L)',
      '  <span class="ok">help</span>          - this menu',
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
        const liveLine = p.link
          ? `  live: <a href="${escapeHtml(p.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.link)}</a>`
          : `  live: internal, behind SSO`;
        return (
          `<h3>${escapeHtml(p.name)}</h3>` +
          `${escapeHtml(p.description)}\n` +
          `  <span style="color: var(--muted)">${escapeHtml(p.facts)}</span>\n` +
          (p.page
            ? `  deep dive: <span class="ok">read ${escapeHtml(p.name)}</span> · <a href="${escapeHtml(p.page)}">${escapeHtml(p.page)}</a>\n`
            : `  no deep dive yet\n`) +
          liveLine
        );
      })
      .join("\n\n");
  },

  skills() {
    return resumeP.then((d) => {
      if (!d || !d.skills) return noResume("skills");
      return d.skills
        .map((g) => `<h3>${typst(g.label)}</h3>  ${typst(g.items)}`)
        .join("\n\n");
    });
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
    return resumeP.then((d) => {
      if (!d || !d.contacts) return noResume("contact");
      return d.contacts
        .map((c) => {
          const ext = !c.url.startsWith("mailto:");
          return `  <a href="${escapeHtml(c.url)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(c.label)}</a>`;
        })
        .join("\n");
    });
  },

  resume() {
    const p = escapeHtml(content.resumePath);
    return `<a href="./">resume page</a> · <a href="${p}" target="_blank" rel="noopener noreferrer">PDF (${p})</a>`;
  },

  theme(args) {
    const arg = args[0];
    const current = currentThemeId();
    if (!arg || arg === "list") {
      const lines = [
        ["auto", "follow the system light/dark setting"],
        ...Object.entries(themes).map(([id, t]) => [id, t.name]),
      ].map(([id, name]) => {
        const marker = id === current ? "•" : " ";
        return `  ${marker} ${id.padEnd(10)} ${escapeHtml(name)}`;
      });
      return (
        "available themes:\n" + lines.join("\n") + "\n\nusage: theme <name>"
      );
    }
    if ((arg === "auto" || hasTheme(arg)) && applyTheme(arg))
      return `theme set to <span class="ok">${escapeHtml(arg === "auto" ? "auto" : themes[arg].name)}</span>.`;
    return { err: `unknown theme: ${escapeHtml(arg)}. try 'theme list'.` };
  },

  banner() {
    return {
      html: `<pre class="banner">${escapeHtml(BANNER)}</pre>`,
      sr: "Danny Yu",
    };
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
      row("Theme", escapeHtml(themeName(currentThemeId()))),
      row("Hobbies", "coding, gaming, lounging"),
      "",
      swatch,
    ];
    const blank = " ".repeat(40); // ART_LINES are 40 visible cols each
    const rows = Math.max(ART_LINES.length, info.length);
    const lines = [];
    for (let r = 0; r < rows; r++) {
      lines.push((ART_LINES[r] || blank) + "   " + (info[r] || ""));
    }
    return {
      html: `<pre class="neofetch">${lines.join("\n")}</pre>`,
      sr: info.slice(0, -2).map(textOf).join("\n"),
    };
  },

  impact() {
    fetch("impact.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((d) => {
        impactData = d;
        if (!impactReady()) {
          const n = d.event_weeks_logged || 0;
          typewrite(
            write(
              escapeHtml(
                `impact: still collecting, ${n} week${n === 1 ? "" : "s"} of usage data so far. ` +
                  `figures publish after ${IMPACT_MIN_WEEKS}.`,
              ),
            ),
          );
          return;
        }
        const approx = (n) => "~" + Number(n).toLocaleString();
        const lines = [
          `impact: Science Alive platform, cumulative since ${d.since}`,
          `  apps in production     ${d.apps_in_production}`,
          `  requests served        ${approx(d.requests_served)}`,
          `  error rate             ${d.error_rate_pct} %`,
          `  lessons served         ${approx(d.lessons_served)}`,
          `  gallery pages viewed   ${approx(d.gallery_pages_viewed)}`,
          `  sponsor pages viewed   ${approx(d.sponsor_pages_viewed)}`,
          `  (updated ${d.updated}; aggregate counts only, no personal data)`,
        ].join("\n");
        typewrite(write(escapeHtml(lines)));
      })
      .catch(() => {
        typewrite(write("impact: could not load impact.json.", "error"));
      });
    return "";
  },

  crt() {
    const on = document.documentElement.classList.toggle("crt");
    try {
      localStorage.setItem("crt", on ? "1" : "");
    } catch (_) {}
    return on
      ? 'CRT mode <span class="ok">on</span>. Hello, 1985.'
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

  read(args) {
    const name = args[0];
    const p = content.projects.find((x) => x.name === name);
    if (!p) {
      const names = content.projects.map((x) => x.name).join(", ");
      return {
        err: `read: unknown project '${escapeHtml(name || "")}'. try: ${names}`,
      };
    }
    if (!p.page) return "no deep dive yet";
    return fetch(p.page)
      .then((r) => r.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const main = doc.querySelector("main");
        const lines = [];
        main.querySelectorAll(":scope > *").forEach((el) => {
          const t = el.textContent.trim();
          if (el.tagName === "H1") lines.push(`<h3>${escapeHtml(t)}</h3>`);
          else if (el.tagName === "H2")
            lines.push(`\n<span class="ok">${escapeHtml(t)}</span>`);
          else if (el.tagName === "PRE")
            lines.push(
              `<span style="color: var(--muted)">${escapeHtml(el.textContent)}</span>`,
            );
          else if (el.tagName === "FIGURE") {
            el.querySelectorAll("ol > li").forEach((li) => {
              const name = li.querySelector("strong");
              const detail = li.querySelector("span");
              lines.push(
                `  → ${escapeHtml((name || li).textContent.trim())}` +
                  (detail ? `: ${escapeHtml(detail.textContent.trim())}` : ""),
              );
            });
            const cap = el.querySelector("figcaption");
            if (cap)
              lines.push(
                `<span style="color: var(--muted)">${escapeHtml(cap.textContent.trim())}</span>`,
              );
          }
          else if (el.tagName === "P" && el.classList.contains("sidenote"))
            lines.push(
              `<span style="color: var(--muted)">  note: ${escapeHtml(t)}</span>`,
            );
          else if (el.tagName === "UL")
            [...el.children].forEach((li) =>
              lines.push(`  • ${escapeHtml(li.textContent.trim())}`),
            );
          else if (el.querySelector("a")) {
            const a = el.querySelector("a");
            lines.push(
              `  <a href="${escapeHtml(a.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.textContent)}</a>`,
            );
          } else lines.push(escapeHtml(t));
        });
        lines.push(
          `\n<span style="color: var(--muted)">full page: <a href="${escapeHtml(p.page)}">${escapeHtml(p.page)}</a></span>`,
        );
        return lines.join("\n");
      })
      .catch(() => ({ err: `read: could not load ${escapeHtml(p.page)}` }));
  },

  whoami() {
    return "you are a visitor. Hopefully you know who you are.";
  },

  echo(args) {
    return escapeHtml(args.join(" "));
  },

  open(args) {
    const target = args[0];
    const project = content.projects.find((p) => p.name === target);
    if (project) {
      if (!project.page) return "no deep dive yet";
      window.location.href = project.page;
      return `opening ${escapeHtml(target)}...`;
    }
    const names = content.projects.map((p) => p.name).join(", ");
    const unknown = {
      err: `open: unknown target '${escapeHtml(target || "")}'. try: github, email, ${names}`,
    };
    if (target !== "github" && target !== "email") return unknown;
    return resumeP.then((d) => {
      if (!d || !d.contacts) return noResume("open");
      const c = d.contacts.find((x) =>
        target === "email"
          ? x.url.startsWith("mailto:")
          : x.url.includes("github.com"),
      );
      if (!c) return unknown;
      window.open(
        c.url,
        target === "email" ? "_self" : "_blank",
        "noopener,noreferrer",
      );
      return `opening ${escapeHtml(target)}...`;
    });
  },

  clear() {
    output.innerHTML = "";
    srLog.innerHTML = "";
    return "";
  },

  sudo() {
    return { err: "nice try. permission denied." };
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
  const show = (r) => {
    if (r && typeof r === "object" && "err" in r)
      typewrite(write(r.err, "error"));
    else if (r && typeof r === "object" && "html" in r)
      typewrite(write(r.html, null, r.sr));
    else if (r) typewrite(write(r));
  };
  const result = fn(args);
  if (result && typeof result.then === "function") {
    const pending = write(
      '<span style="color: var(--muted)">loading…</span>',
      null,
      "",
    );
    result.then((r) => {
      pending.remove();
      show(r);
    });
    return;
  }
  show(result);
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
  } else if (e.key === "Tab" && !e.shiftKey && input.value.trim()) {
    // only swallow Tab when there is something to complete
    if (autocomplete()) e.preventDefault();
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

// returns true when a completion or a list of candidates was shown
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
    return matches.length > 0;
  }

  // context-aware second-token completion
  const [cmd, arg = ""] = parts;
  let pool = null;
  if (cmd === "cat") pool = SECTIONS;
  if (cmd === "theme") pool = ["auto", ...Object.keys(themes)];
  if (cmd === "open")
    pool = ["github", "email", ...content.projects.map((p) => p.name)];
  if (cmd === "read") pool = content.projects.map((p) => p.name);

  if (pool) {
    const matches = pool.filter((n) => n.startsWith(arg));
    if (matches.length === 1) input.value = `${cmd} ${matches[0]}`;
    else if (matches.length > 1) write(matches.join("  "));
    return matches.length > 0;
  }
  return false;
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

// stop blinking after 5s without typing (kitty's cursor_stop_blinking_after)
let idleTimer = 0;
function wakeCaret() {
  form.classList.remove("caret-idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => form.classList.add("caret-idle"), 5000);
}
wakeCaret();

["input", "keydown", "keyup", "click", "focus", "blur", "select"].forEach(
  (ev) =>
    input.addEventListener(ev, () => {
      if (ev === "input" || ev === "keydown" || ev === "focus") wakeCaret();
      setTimeout(updateCaret, 0);
    }),
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

// clicks in the terminal area return focus to the prompt; controls, the
// status bar (reader.js) and text selections keep theirs
document.addEventListener("click", (e) => {
  if (!e.target.closest("#content")) return;
  if (e.target.closest("a, button, input, label, dialog")) return;
  if (String(window.getSelection())) return;
  input.focus();
});

// ---------- boot sequence ----------
const bootLines = [
  { t: 90, text: "[  OK  ] Mounting /home/danny" },
  { t: 160, text: "[  OK  ] Calibrating personality matrices" },
  {
    t: 160,
    text: "[  WARN  ] No where to be found",
  },
  { t: 160, text: "[  OK  ] Brewing morning tea routine" },
  { t: 180, text: "[  OK  ] Mounting coding.fs, gaming.fs, lounging.fs" },
  {
    t: 220,
    text: "[ WARN ] knees.daemon below threshold (user is getting old), stretching",
    cls: "warn",
  },
  {
    t: 240,
    text: "[ FAIL ] impostor-syndrome.service, masking, moving on",
    cls: "error",
  },
  {
    t: 180,
    text: "[  OK  ] /curriculum online, classroom.sock listening on :8080",
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
      write(escapeHtml(line.text), (line.cls || "ok") + " boot-line", "");
    }
  }
  const d = await resumeP;
  write(`<pre class="banner">${escapeHtml(BANNER)}</pre>`, null, "Danny Yu");
  if (d) {
    write(
      `<span style="color: var(--accent)">${typst(d.name)}</span> - ` +
        `<span style="color: var(--muted)">${typst(d.role)}</span>`,
    );
  } else {
    write(
      `<span style="color: var(--muted)">resume data didn't load; skills, contact and open github/email are unavailable.</span>`,
    );
  }
  write(
    `<span style="color: var(--muted)">last updated ${escapeHtml(content.updated)}</span>`,
  );
  write("");
  write(
    `type <span class="ok">help</span> to see commands, ` +
      `or <span class="ok">about</span> to start.`,
  );
  write("");
  input.focus();
  const run = new URLSearchParams(location.search).get("run");
  if (run) dispatch(run);
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
  fetch("impact.json", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      impactData = d;
    })
    .catch(() => {});
  boot();
})();
