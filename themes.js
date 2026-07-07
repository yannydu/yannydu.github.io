// color themes. add more by copying any block and changing the values.
// all themes use the same CSS variable names (--bg, --fg, --accent, ...)
// so styles.css stays theme-agnostic.

const themes = {
  kanagawa: {
    name: "Kanagawa Dragon",
    bg:     "#181616",
    bgAlt:  "#282727",
    fg:     "#c5c9c5",
    muted:  "#a6a69c",
    accent: "#8ea4a2",
    red:    "#c4746e",
    orange: "#b6927b",
    yellow: "#c4b28a",
    green:  "#87a987",
    blue:   "#658594",
    purple: "#a292a3"
  },
  dracula: {
    name: "Dracula",
    bg:     "#282a36",
    bgAlt:  "#44475a",
    fg:     "#f8f8f2",
    muted:  "#6272a4",
    accent: "#bd93f9",
    red:    "#ff5555",
    orange: "#ffb86c",
    yellow: "#f1fa8c",
    green:  "#50fa7b",
    blue:   "#8be9fd",
    purple: "#bd93f9"
  },
  gruvbox: {
    name: "Gruvbox Dark",
    bg:     "#282828",
    bgAlt:  "#3c3836",
    fg:     "#ebdbb2",
    muted:  "#928374",
    accent: "#fabd2f",
    red:    "#fb4934",
    orange: "#fe8019",
    yellow: "#fabd2f",
    green:  "#b8bb26",
    blue:   "#83a598",
    purple: "#d3869b"
  },
  nord: {
    name: "Nord",
    bg:     "#2e3440",
    bgAlt:  "#3b4252",
    fg:     "#d8dee9",
    muted:  "#7b88a1",
    accent: "#88c0d0",
    red:    "#bf616a",
    orange: "#d08770",
    yellow: "#ebcb8b",
    green:  "#a3be8c",
    blue:   "#81a1c1",
    purple: "#b48ead"
  },
  matrix: {
    name: "Matrix",
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

function applyTheme(id) {
  const t = themes[id];
  if (!t) return false;
  const root = document.documentElement;
  Object.entries(t).forEach(([k, v]) => {
    if (k === "name") return;
    root.style.setProperty("--" + k, v);
  });
  try { localStorage.setItem("theme", id); } catch (_) {}
  return true;
}
