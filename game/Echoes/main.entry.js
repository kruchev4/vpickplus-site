// main.entry.js
const params = new URLSearchParams(location.search);

// Priority: URL param overrides localStorage
const channel =
  params.get("channel") ||
  localStorage.getItem("roeChannel") ||
  "live";

// Cache-bust helper (optional)
const v = params.get("v") ? `?v=${encodeURIComponent(params.get("v"))}` : "";

if (channel === "dev") {
  await import(`./main.dev.js${v}`);
} else {
  await import(`./main.live.js${v}`);
}

// IMPORTANT:
// Your imported module currently sets window.startEngine and dispatches 'module-ready'.
// So main.entry.js does NOT dispatch it again (prevents double-fire).
