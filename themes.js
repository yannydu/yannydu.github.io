// color themes. add more by copying any block and changing the values.
// all themes use the same CSS variable names (--bg, --fg, --accent, ...)
// so styles.css stays theme-agnostic.

const themes = {
  __proto__: null, // ids come from links and storage: themes["constructor"] must not resolve
  latte: {
    name: "Catppuccin Latte",
    scheme: "light",
    bg:     "#eff1f5",
    bgAlt:  "#e6e9ef",
    fg:     "#4c4f69",
    muted:  "#5c5f77",
    accent: "#1b5de1",
    red:    "#cd0e37",
    orange: "#b14507",
    yellow: "#905c12",
    green:  "#2f761f",
    blue:   "#167080",
    purple: "#8537ea"
  },
  mocha: {
    name: "Catppuccin Mocha",
    scheme: "dark",
    bg:     "#1e1e2e",
    bgAlt:  "#181825",
    fg:     "#cdd6f4",
    muted:  "#a6adc8",
    accent: "#89b4fa",
    red:    "#f38ba8",
    orange: "#fab387",
    yellow: "#f9e2af",
    green:  "#a6e3a1",
    blue:   "#74c7ec",
    purple: "#cba6f7"
  },
  kanagawa: {
    name: "Kanagawa Dragon",
    scheme: "dark",
    bg:     "#181616",
    bgAlt:  "#282727",
    fg:     "#c5c9c5",
    muted:  "#a6a69c",
    accent: "#8ea4a2",
    red:    "#cc7c76",
    orange: "#b6927b",
    yellow: "#c4b28a",
    green:  "#87a987",
    blue:   "#7f9fae",
    purple: "#a292a3"
  },
  dracula: {
    name: "Dracula",
    scheme: "dark",
    bg:     "#282a36",
    bgAlt:  "#44475a",
    fg:     "#f8f8f2",
    muted:  "#b0b8d1",
    accent: "#caa9fa",
    red:    "#ff9e9e",
    orange: "#ffb86c",
    yellow: "#f1fa8c",
    green:  "#50fa7b",
    blue:   "#8be9fd",
    purple: "#caa9fa"
  },
  gruvbox: {
    name: "Gruvbox Dark",
    scheme: "dark",
    bg:     "#282828",
    bgAlt:  "#3c3836",
    fg:     "#ebdbb2",
    muted:  "#ada296",
    accent: "#fabd2f",
    red:    "#fc7f70",
    orange: "#fe8019",
    yellow: "#fabd2f",
    green:  "#b8bb26",
    blue:   "#8bab9f",
    purple: "#d690a4"
  },
  nord: {
    name: "Nord",
    scheme: "dark",
    bg:     "#2e3440",
    bgAlt:  "#3b4252",
    fg:     "#d8dee9",
    muted:  "#a7b0c0",
    accent: "#88c0d0",
    red:    "#d9a1a7",
    orange: "#dba392",
    yellow: "#ebcb8b",
    green:  "#a3be8c",
    blue:   "#9ab3cd",
    purple: "#c5a7bf"
  },
  matrix: {
    name: "Matrix",
    scheme: "dark",
    bg:     "#000000",
    bgAlt:  "#0d0d0d",
    fg:     "#00ff66",
    muted:  "#0ea34a",
    accent: "#00ff66",
    red:    "#ff4141",
    orange: "#ffaa00",
    yellow: "#ccff00",
    green:  "#00ff66",
    blue:   "#41ffb4",
    purple: "#a0ff41"
  },
  paper: {
    name: "Paper (high-contrast light)",
    scheme: "light",
    bg:     "#fafaf7",
    bgAlt:  "#eeeee8",
    fg:     "#1a1917",
    muted:  "#5a5a53",
    accent: "#1f4e8a",
    red:    "#9a2a24",
    orange: "#a35318",
    yellow: "#7a5f14",
    green:  "#2f5a23",
    blue:   "#1f4e8a",
    purple: "#6a2f7a"
  }
};

// "auto" (the default) is not a theme: it clears every inline override so the
// prefers-color-scheme rules in styles.css (Latte / Mocha) apply again.
function applyTheme(id) {
  const root = document.documentElement;
  if (id === "auto") {
    Object.values(themes).forEach((t) => {
      Object.keys(t).forEach((k) => {
        if (k !== "name" && k !== "scheme") root.style.removeProperty("--" + k);
      });
    });
    root.style.removeProperty("color-scheme");
    try { localStorage.removeItem("theme"); } catch (_) {}
    document.dispatchEvent(new CustomEvent("themechange", { detail: id }));
    return true;
  }
  const t = themes[id];
  if (!t) return false;
  Object.entries(t).forEach(([k, v]) => {
    if (k === "name" || k === "scheme") return;
    root.style.setProperty("--" + k, v);
  });
  root.style.colorScheme = t.scheme;
  try { localStorage.setItem("theme", id); } catch (_) {}
  document.dispatchEvent(new CustomEvent("themechange", { detail: id }));
  return true;
}
