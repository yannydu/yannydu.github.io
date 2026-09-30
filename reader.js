// Pager behaviour for every page: status bar, keys, search, command line, help
// dialog, sidebar sections, and (on index.html) the resume rendered from
// resume/resume.json. Plain JS, no build step. Loaded with a classic <script>.
(function () {
  "use strict";

  const ROOT = new URL("./", document.currentScript.src);
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = () => (reduced ? "auto" : "smooth");
  const page = document.body.dataset.page || "";
  const isHome = page === "resume(1)";
  const PDF_PATH =
    (typeof content !== "undefined" && content.resumePath) ||
    "resume/Danny_Yu_Resume.pdf";

  // ---------- storage (every access guarded) ----------
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch (_) {}
    return null;
  }

  // ---------- small DOM helper ----------
  function el(tag, cls, ...kids) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    kids.forEach((k) => {
      if (k == null) return;
      n.append(k);
    });
    return n;
  }
  function link(href, text, ext) {
    const a = el("a");
    a.href = href;
    if (ext) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.append(text + " ↗", el("span", "sr-only", " (opens in new tab)"));
    } else a.textContent = text;
    return a;
  }

  // ---------- live region ----------
  const srLog = document.getElementById("sr-log");
  let live = srLog;
  if (!live) {
    live = el("div", "sr-only");
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    document.body.append(live);
  }
  function announce(msg) {
    live.textContent = "";
    requestAnimationFrame(() => {
      live.textContent = msg;
    });
  }

  // ---------- resume.json ----------
  let resumeP = null;
  function getResume() {
    if (!resumeP)
      resumeP = fetch(new URL("resume/resume.json", ROOT)).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
    return resumeP;
  }

  // Typst markup subset: *bold*, `code`, backslash escapes (the escaped char is
  // literal). Numbers go bold. "\n" becomes a line break.
  function markup(str) {
    const frag = document.createDocumentFragment();
    let buf = "";
    const flush = () => {
      buf.split(/(\d[\d,.]*\+?)/).forEach((part, i) => {
        if (i % 2 === 0) return part && frag.append(part);
        const m = part.match(/^(.*?)([.,]*)$/);
        frag.append(el("strong", "", m[1]));
        if (m[2]) frag.append(m[2]);
      });
      buf = "";
    };
    const re = /\\(.)|\*([^*]+)\*|`([^`]+)`|\n/g;
    let last = 0;
    let m;
    while ((m = re.exec(str))) {
      buf += str.slice(last, m.index);
      last = re.lastIndex;
      if (m[1] != null) buf += m[1];
      else if (m[0] === "\n") {
        flush();
        frag.append(document.createElement("br"));
      } else {
        flush();
        frag.append(el(m[2] != null ? "strong" : "code", "", m[2] != null ? m[2] : m[3]));
      }
    }
    buf += str.slice(last);
    flush();
    return frag;
  }

  function dateEl(s) {
    const p = el("p", "date");
    const parts = String(s).split(" – ");
    if (parts.length > 1) p.append(parts[0], document.createElement("br"), "– " + parts[1]);
    else p.textContent = s;
    return p;
  }

  function bulletList(bullets) {
    const ul = el("ul");
    ul.setAttribute("role", "list");
    bullets.forEach((b) => {
      const o = typeof b === "string" ? { text: b } : b;
      const li = el("li", "", markup(o.text));
      if (o.note) li.append(el("p", "sidenote", markup(o.note)));
      ul.append(li);
    });
    return ul;
  }

  function resumeEntry(e) {
    const head = el("div", "head", el("h3", "", e.role));
    const line = el("p", "", el("span", "org", e.org));
    if (e.place) line.append(" ", el("span", "muted", "· " + e.place));
    head.append(line);
    const art = el("article", "entry", dateEl(e.dates), head);
    if (e.bullets && e.bullets.length) art.append(bulletList(e.bullets));
    return art;
  }

  function projectEntry(p) {
    const status = el("p", "date", el("strong", p.status === "live" ? "ok" : "", p.status));
    const head = el("div", "head");
    if (p.image) {
      const img = el("img");
      img.src = new URL(p.image.src, ROOT).href;
      img.alt = p.image.alt;
      if (p.image.width) img.width = p.image.width;
      if (p.image.height) img.height = p.image.height;
      img.loading = "lazy";
      const cap = el("figcaption", "", "$ kitten icat " + p.image.src.split("/").pop());
      head.append(el("figure", "logo", el("div", "plate", img), cap));
    }
    const title = p.name.toLowerCase() + "(7)";
    const h3 = el("h3");
    if (p.page) h3.append(link(new URL(p.page, ROOT).href, title));
    else h3.textContent = title;
    const desc = el("p", "", p.description);
    if (p.link) desc.append(" ", link(p.link, p.link.replace(/^https?:\/\//, ""), true));
    head.append(h3, desc);
    const art = el("article", "entry", status, head);
    if (p.facts) art.append(el("p", "sidenote", markup(p.facts.split(" · ").join("\n"))));
    return art;
  }

  function section(id, title, ...kids) {
    const s = el("section", "", el("h2", "", title), ...kids);
    s.id = id;
    return s;
  }

  function buildSections(r) {
    const out = [];
    out.push(section("synopsis", "Synopsis", el("p", "", markup(r.summary))));
    out.push(section("experience", "Experience", ...r.experience.map(resumeEntry)));
    const projs = typeof content !== "undefined" && content.projects ? content.projects : [];
    if (projs.length) out.push(section("projects", "Projects", ...projs.map(projectEntry)));
    const dl = el("dl");
    r.skills.forEach((s) => {
      dl.append(el("dt", "", s.label), el("dd", "", s.items));
    });
    out.push(section("skills", "Skills", dl));
    const comm = typeof content !== "undefined" && content.community ? content.community : [];
    if (comm.length)
      out.push(
        section(
          "community",
          "Community",
          ...comm.map((c) => {
            const d = c.description || "";
            return el(
              "article",
              "entry",
              dateEl(c.dates),
              el("div", "head", el("h3", "", c.role), el("p", "", d.charAt(0).toUpperCase() + d.slice(1)))
            );
          })
        )
      );
    out.push(section("education", "Education", ...r.education.map(resumeEntry)));
    return out;
  }

  function renderResume() {
    const box = document.getElementById("resume");
    const main = document.querySelector("main");
    return getResume()
      .then((r) => {
        const anchor = document.getElementById("see-also");
        buildSections(r).forEach((sec) => main.insertBefore(sec, anchor));
        box.remove();
        const role = document.querySelector(".role");
        if (role && r.role) role.textContent = r.role;
        const up = document.getElementById("updated");
        if (up && typeof content !== "undefined" && content.updated)
          up.replaceChildren("page updated", document.createElement("br"), content.updated);
        const list = document.querySelector(".side-contact");
        if (list) {
          const items = r.contacts
            .filter((c) => !/^https?:\/\/yannydu\.github\.io\/?$/.test(c.url))
            .map((c) => {
              const ext = /^https?:/.test(c.url);
              return el("li", "", link(c.url, c.label, ext));
            });
          list.prepend(...items);
        }
      })
      .catch(() => {
        if (!box.isConnected) main.insertBefore(box, document.getElementById("see-also"));
        const a = link(new URL(PDF_PATH, ROOT).href, "Download the PDF (resume.pdf)");
        a.setAttribute("download", "");
        box.replaceChildren(el("p", "", "The resume didn't load. ", a));
      });
  }

  // ---------- header / status-bar heights ----------
  const header = document.querySelector("body > header");
  function syncHeights() {
    [[header, "--header-h"], [statusbar, "--status-h"]].forEach(([n, v]) => {
      if (!n) return;
      const pos = getComputedStyle(n).position;
      const h = pos === "sticky" || pos === "fixed" ? n.offsetHeight : 0;
      root.style.setProperty(v, h + "px");
    });
  }
  const headerH = () => parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 0;
  const lineH = () => 1.5 * parseFloat(getComputedStyle(root).fontSize);

  // ---------- keys, actions ----------
  let keysOn = store("keys") !== "off";
  const THEMES = ["auto", "latte", "mocha"];
  let themeNow = store("theme") || "auto";
  const curTheme = () => themeNow;

  function setThemeLabel() {
    if (themeName) themeName.textContent = curTheme();
  }
  function setTheme(id) {
    if (typeof applyTheme !== "function") return false;
    const ok = applyTheme(id);
    if (ok) {
      themeNow = id;
      setThemeLabel();
      announce("theme: " + id);
    }
    return ok;
  }
  function cycleTheme() {
    const i = THEMES.indexOf(curTheme());
    setTheme(i < 0 ? "auto" : THEMES[(i + 1) % THEMES.length]);
  }

  const scrollBy = (n) => window.scrollBy({ top: n * lineH(), behavior: behavior() });
  const toTop = () => window.scrollTo({ top: 0, behavior: behavior() });
  const toEnd = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: behavior() });
  const goHome = () => {
    location.href = new URL("./", ROOT).href;
  };

  function headings() {
    return [...document.querySelectorAll("main h2")].filter((h) => h.offsetParent !== null);
  }
  function stepHeading(dir) {
    const hs = headings();
    const top = headerH();
    let t = null;
    const at = hs.indexOf(document.activeElement);
    if (at >= 0) t = hs[at + dir];
    else if (dir > 0) t = hs.find((h) => h.getBoundingClientRect().top > top + 4);
    else t = [...hs].reverse().find((h) => h.getBoundingClientRect().top < top - 4);
    if (!t) return announce(dir > 0 ? "last section" : "first section");
    t.focus({ preventScroll: true });
    t.scrollIntoView({ behavior: behavior(), block: "start" });
  }

  // ---------- search ----------
  const search = { ranges: [], i: -1, active: false };
  const hasHL = typeof CSS !== "undefined" && CSS.highlights && typeof Highlight !== "undefined";
  function clearSearch() {
    const was = search.active;
    search.active = false;
    search.ranges = [];
    search.i = -1;
    if (hasHL) {
      CSS.highlights.delete("search");
      CSS.highlights.delete("search-current");
    } else if (was) getSelection().removeAllRanges();
  }
  function collect(q) {
    const main = document.querySelector("main");
    const out = [];
    if (!main || !q) return out;
    const needle = q.toLowerCase();
    const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest('[aria-hidden="true"],script,style,noscript,[hidden],.sr-only'))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n;
    while ((n = w.nextNode())) {
      const text = n.nodeValue.toLowerCase();
      let at = 0;
      while ((at = text.indexOf(needle, at)) >= 0) {
        const r = document.createRange();
        r.setStart(n, at);
        r.setEnd(n, at + needle.length);
        out.push(r);
        at += needle.length;
      }
    }
    return out;
  }
  function showMatch() {
    const r = search.ranges[search.i];
    if (hasHL) {
      CSS.highlights.set("search", new Highlight(...search.ranges));
      CSS.highlights.set("search-current", new Highlight(r));
    } else {
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
    const box = r.getBoundingClientRect();
    window.scrollBy({ top: box.top + box.height / 2 - innerHeight / 2, behavior: behavior() });
    announce("match " + (search.i + 1) + " of " + search.ranges.length);
  }
  function runSearch(q) {
    clearSearch();
    search.ranges = collect(q);
    if (!search.ranges.length) return announce("not found");
    search.active = true;
    search.i = 0;
    showMatch();
  }
  function step(dir) {
    if (!search.active) return stepHeading(dir);
    search.i = (search.i + dir + search.ranges.length) % search.ranges.length;
    showMatch();
  }

  // ---------- commands ----------
  function runCommand(line) {
    const [cmd, ...args] = line.trim().split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    switch (cmd.toLowerCase()) {
      case "":
        return;
      case "help":
        return openHelp();
      case "top":
        return toTop();
      case "end":
        return toEnd();
      case "q":
        return goHome();
      case "shell":
        location.href = new URL("shell.html", ROOT).href;
        return;
      case "theme": {
        if (!arg || arg === "list")
          return announce(
            "themes: auto, " + (typeof themes !== "undefined" ? Object.keys(themes).join(", ") : "")
          );
        if (arg === "auto" || (typeof themes !== "undefined" && themes[arg])) return void setTheme(arg);
        return announce("unknown theme " + arg);
      }
      case "open":
        return openTarget(arg);
      default:
        location.href = new URL("shell.html?run=" + encodeURIComponent(line.trim()), ROOT).href;
    }
  }
  function openTarget(arg) {
    if (arg === "resume") {
      location.href = new URL(PDF_PATH, ROOT).href;
      return;
    }
    if (arg === "github" || arg === "email") {
      getResume().then(
        (r) => {
          const c = r.contacts.find((x) =>
            arg === "github" ? /github\.com/.test(x.url) : /^mailto:/.test(x.url)
          );
          if (c) location.href = c.url;
          else announce("no " + arg + " contact");
        },
        () => announce("resume.json didn't load")
      );
      return;
    }
    const projs = typeof content !== "undefined" && content.projects ? content.projects : [];
    const p = projs.find((x) => x.name.toLowerCase() === arg);
    if (p && p.page) location.href = new URL(p.page, ROOT).href;
    else if (p && p.link) location.href = p.link;
    else announce("nothing to open for " + arg);
  }

  // ---------- key table: drives key handler, status-bar hints, help dialog ----------
  const KEYS = [
    { k: "/", label: "search", desc: "search this page", cls: "sb-search", hint: true, run: () => openLine("search") },
    { k: "n", label: "next", desc: "next match, or next section", hint: true, run: () => step(1) },
    { k: "N", label: "previous", desc: "previous match, or previous section", run: () => step(-1) },
    { k: "g", label: "top", desc: "go to top", cls: "sb-top", hint: true, run: toTop },
    { k: "G", label: "end", desc: "go to end", hint: true, run: toEnd },
    { k: "j", label: "down", desc: "scroll down 3 lines", run: () => scrollBy(3) },
    { k: "k", label: "up", desc: "scroll up 3 lines", run: () => scrollBy(-3) },
    { k: "?", label: "help", desc: "show this list", hint: true, run: () => openHelp(), noDo: true },
    { k: "q", label: "back", desc: "back to resume(1)", hint: true, run: goHome, skip: isHome },
    { k: ":", label: "command", desc: "command line", cls: "sb-cmd-btn", hint: true, run: () => openLine("command") },
    { k: "t", label: "theme", desc: "cycle theme: auto, latte, mocha", run: cycleTheme },
  ].filter((e) => !e.skip);
  const byKey = {};
  KEYS.forEach((e) => (byKey[e.k] = e));

  function kbd(t) {
    return el("kbd", "", t);
  }
  function hintBtn(e) {
    const b = el("button", "sb-key" + (e.cls ? " " + e.cls : ""), kbd(e.k), " " + e.label);
    b.type = "button";
    b.addEventListener("click", () => e.run());
    return b;
  }

  // ---------- status bar ----------
  const statusbar = el("footer", "statusbar");
  const pos = el("span", "sb-pos", "");
  const keysGroup = el("div", "sb-keys");
  keysGroup.setAttribute("role", "group");
  keysGroup.setAttribute("aria-label", "Pager keys");
  const sidebar = document.getElementById("sidebar");
  let secBtn = null;
  if (sidebar) {
    secBtn = el("button", "sb-key sb-sections", "sections");
    secBtn.type = "button";
    secBtn.setAttribute("aria-expanded", "false");
    secBtn.setAttribute("aria-controls", "sidebar");
    keysGroup.append(secBtn);
  }
  KEYS.filter((e) => e.hint).forEach((e, i) => {
    keysGroup.append(hintBtn(e));
    if (i === 0) {
      const sep = el("span", "sb-sep", "·");
      sep.setAttribute("aria-hidden", "true");
      keysGroup.append(sep);
    }
  });
  const toggle = el("button", "sb-toggle", "keys");
  toggle.type = "button";
  const toggleState = el("span", "", "");
  toggleState.setAttribute("aria-hidden", "true");
  toggle.append(toggleState);
  function showKeysState() {
    toggle.setAttribute("aria-pressed", String(keysOn));
    toggleState.textContent = keysOn ? ": on" : ": off";
  }
  showKeysState();
  toggle.addEventListener("click", () => {
    keysOn = !keysOn;
    store("keys", keysOn ? "on" : "off");
    showKeysState();
    announce("keys " + (keysOn ? "on" : "off"));
  });
  const themeName = el("span", "sb-theme-name", curTheme());
  const themeBtn = el("button", "sb-key sb-theme", kbd("t"), " theme: ", themeName);
  themeBtn.type = "button";
  themeBtn.addEventListener("click", cycleTheme);
  const pdf = el("a", "sb-pdf", "resume.pdf ↓");
  pdf.href = new URL(PDF_PATH, ROOT).href;
  pdf.setAttribute("download", "");
  statusbar.append(
    el("p", "sb-page", page + " ", pos),
    keysGroup,
    el("div", "sb-right", toggle, themeBtn, pdf)
  );
  document.body.append(statusbar);

  // ---------- sidebar fold (phones) ----------
  if (sidebar && secBtn) {
    const mq = matchMedia("(max-width: 800px)");
    const sync = () => {
      if (mq.matches && root.classList.contains("js") && !secBtn.dataset.opened) sidebar.hidden = true;
      if (!mq.matches) sidebar.hidden = false;
      secBtn.setAttribute("aria-expanded", String(!sidebar.hidden));
    };
    sync();
    mq.addEventListener("change", () => {
      delete secBtn.dataset.opened;
      sync();
    });
    secBtn.addEventListener("click", () => {
      sidebar.hidden = !sidebar.hidden;
      if (!sidebar.hidden) secBtn.dataset.opened = "1";
      else delete secBtn.dataset.opened;
      secBtn.setAttribute("aria-expanded", String(!sidebar.hidden));
    });
    sidebar.addEventListener("click", (e) => {
      if (mq.matches && e.target.closest("nav a")) {
        sidebar.hidden = true;
        delete secBtn.dataset.opened;
        secBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- command / search line ----------
  let lineForm = null;
  function closeLine(focusBack) {
    if (!lineForm) return;
    const mode = lineForm.dataset.mode;
    lineForm.remove();
    lineForm = null;
    keysGroup.hidden = false;
    if (focusBack) {
      const b = keysGroup.querySelector(mode === "search" ? ".sb-search" : ".sb-cmd-btn");
      if (b) b.focus();
    }
  }
  function openLine(mode) {
    closeLine(false);
    clearSearch();
    const input = el("input");
    input.id = "sb-cmd";
    input.type = "text";
    input.autocomplete = "off";
    input.placeholder = mode === "search" ? "search" : "type a command, e.g. neofetch";
    const colon = el("span", "", mode === "search" ? "/" : ":");
    colon.setAttribute("aria-hidden", "true");
    const label = el("label", "", colon, el("span", "sr-only", mode === "search" ? "search" : "command"));
    label.htmlFor = "sb-cmd";
    lineForm = el("form", "sb-cmdform", label, input);
    lineForm.dataset.mode = mode;
    lineForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input.value;
      closeLine(true);
      if (mode === "search") runSearch(v);
      else runCommand(v);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeLine(true);
        if (mode === "search") clearSearch();
      }
    });
    keysGroup.hidden = true;
    keysGroup.after(lineForm);
    input.focus();
  }

  // ---------- help dialog ----------
  const dialog = el("dialog", "help");
  dialog.id = "help";
  dialog.setAttribute("aria-labelledby", "help-title");
  const helpTitle = el("h2", "", "Keys");
  helpTitle.id = "help-title";
  const dl = el("dl", "help-keys");
  KEYS.forEach((e) => {
    const dd = el("dd", "", e.desc + " ");
    if (!e.noDo) {
      const b = el("button", "help-do", e.label);
      b.type = "button";
      b.addEventListener("click", () => {
        dialog.close();
        e.run();
      });
      dd.append(b);
    }
    dl.append(el("div", "", el("dt", "", kbd(e.k)), dd));
  });
  dl.append(el("div", "", el("dt", "", kbd("Esc")), el("dd", "", "close the command line or clear the search")));
  const closeBtn = el("button", "help-close", "close");
  closeBtn.type = "button";
  closeBtn.addEventListener("click", () => dialog.close());
  dialog.append(helpTitle, dl, closeBtn);
  document.body.append(dialog);
  function openHelp() {
    if (!dialog.open) dialog.showModal();
  }

  // ---------- global key handler ----------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && search.active && !document.querySelector("dialog[open]") && !lineForm) {
      clearSearch();
      announce("search cleared");
      return;
    }
    if (!keysOn || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return;
    if (document.querySelector("dialog[open]")) return;
    const t = e.target;
    if (t && t.closest && t.closest("input,textarea,select,[contenteditable]")) return;
    const entry = byKey[e.key];
    if (!entry) {
      if (e.key === "'") e.preventDefault();
      return;
    }
    if (e.key === "/" || e.key === "'") e.preventDefault();
    e.preventDefault();
    entry.run();
  });

  // ---------- position, heights ----------
  let raf = 0;
  let updateCurrent = null;
  function updatePos() {
    raf = 0;
    const lh = lineH();
    const total = Math.max(1, Math.ceil(root.scrollHeight / lh));
    const y = window.scrollY;
    const n = Math.min(total, Math.floor(y / lh) + 1);
    const range = root.scrollHeight - innerHeight;
    const pct = range > 0 ? Math.round((y / range) * 100) : 100;
    if (updateCurrent) updateCurrent();
    pos.textContent = "line " + n + "/" + total + " " + Math.min(100, pct) + "%";
  }
  const queue = () => {
    if (!raf) raf = requestAnimationFrame(updatePos);
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", () => {
    syncHeights();
    queue();
  });
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => {
      syncHeights();
      queue();
    });
    if (header) ro.observe(header);
    ro.observe(statusbar);
  }
  syncHeights();
  updatePos();

  // ---------- sections nav ----------
  function setupSections() {
    const hs = headings();
    hs.forEach((h) => h.setAttribute("tabindex", "-1"));
    if (!sidebar || !hs.length) return;
    const used = new Set([...document.querySelectorAll("[id]")].map((n) => n.id));
    const targets = hs.map((h) => {
      const t = h.closest("section[id]") || h;
      if (!t.id) {
        const base = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
        let id = base;
        for (let n = 2; used.has(id); n++) id = base + "-" + n;
        used.add(id);
        t.id = id;
      }
      return t;
    });
    const pagesNav = sidebar.querySelector('nav[aria-labelledby="pages-label"]');
    const nav = el("nav");
    nav.setAttribute("aria-label", "Sections");
    const ul = el("ul", "side-list");
    ul.setAttribute("role", "list");
    const links = targets.map((t, i) => {
      const a = el("a", "", hs[i].textContent);
      a.href = "#" + t.id;
      ul.append(el("li", "", a));
      return a;
    });
    nav.append(el("p", "side-label", pagesNav ? "THIS PAGE" : "SECTIONS"), ul);
    if (pagesNav) pagesNav.after(nav);
    else sidebar.prepend(nav);

    let current = -1;
    updateCurrent = () => {
      const limit = headerH() + innerHeight * 0.25;
      let idx = 0;
      targets.forEach((t, i) => {
        if (t.getBoundingClientRect().top <= limit) idx = i;
      });
      if (innerHeight + window.scrollY >= root.scrollHeight - 2) idx = targets.length - 1;
      if (idx === current) return;
      if (current >= 0) links[current].removeAttribute("aria-current");
      current = idx;
      links[idx].setAttribute("aria-current", "location");
    };
    updateCurrent();
    if (location.hash) {
      let id = location.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch (_) {}
      const t = document.getElementById(id);
      if (t) t.scrollIntoView();
    }
    queue();
  }

  const ready = document.getElementById("resume") ? renderResume() : Promise.resolve();
  ready.then(setupSections, setupSections);
})();
