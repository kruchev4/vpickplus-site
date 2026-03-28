// ╔══════════════════════════════════════════════════════╗
// ║                  GAME MENU (UI ONLY)               ║
// ╚══════════════════════════════════════════════════════╝
//
// IMPORTANT:
// - This module is UI / DOM ONLY
// - It must NOT control rendering or animation frames
// - It must NOT call render(), updateHUD(), or RAF
// - It may READ game state, but must not OWN it
//

let _menuOpen = false;

// ---------- OPEN / CLOSE ----------

export function openGameMenu() {
  const G = window.G;
  if (!G?.cls || !G?.name) return; // no character yet

  _menuOpen = true;

  // Header line
  document.getElementById("menu-char-line")?.textContent =
    `${G.name} · ${G.race?.name || "?"} ${G.cls?.name || "?"} · Level ${G.level}`;

  // Status line
  const parts = [];
  if (G.inCombat) parts.push("⚔ In combat");
  if (window.campState) {
    const c = window.campState;
    parts.push(`📜 Campaign: ${c.camp.name} (Room ${c.prog.roomIdx + 1}/${c.camp.rooms.length})`);
  }
  if (window.coopActive) {
    const count = (window.coopParty || []).filter(Boolean).length;
    parts.push(`👥 Party: ${count} members`);
  }
  parts.push(`💰 ${G.gold} gp · ${G.hp}/${G.hpMax} HP`);

  document.getElementById("menu-status")?.innerHTML = parts.join("<br>");

  // Campaign buttons
  const inCamp = !!window.campState;
  const canPause = inCamp && !G.inCombat;

  const pauseBtn = document.getElementById("menu-btn-pause-camp");
  const exitBtn  = document.getElementById("menu-btn-exit-camp");

  if (pauseBtn) pauseBtn.style.display = canPause ? "block" : "none";
  if (exitBtn)  exitBtn.style.display  = inCamp ? "block" : "none";

  document.getElementById("ov-menu")?.classList.add("active");
}

export function closeGameMenu() {
  _menuOpen = false;
  document.getElementById("ov-menu")?.classList.remove("active");
}

// ---------- SIMPLE ACTIONS ----------

export function menuResume() {
  closeGameMenu();
}

export function menuSave() {
  if (typeof window.saveGame === "function") {
    window.saveGame();
  }

  if (typeof window.cloudSyncNow === "function") {
    window.cloudSyncNow(false);
  }

  document.getElementById("menu-status")!.innerHTML =
    "✓ Saved at " + new Date().toLocaleTimeString();
}

export function menuShowSyncInfo() {
  closeGameMenu();

  if (!window.getPlayerToken) return;

  const tok = window.getPlayerToken();
  if (!tok) return;

  const short = tok.slice(0, 8) + "…" + tok.slice(-4);
  const msg =
    `Your Player ID:\n${tok}\n\n` +
    `This ID links your character to the cloud.\n` +
    `Copy it to play on another device.\n\n` +
    `Press OK to copy to clipboard.`;

  if (confirm(msg)) {
    navigator.clipboard?.writeText(tok)
      .then(() => window.toast?.("Player ID copied!"))
      .catch(() => window.toast?.("ID: " + short));
  }
}

// ---------- CAMPAIGN CONTROLS ----------
// NOTE: These NO LONGER control rendering or RAF.
// They ONLY toggle state + UI.

export function menuPauseCampaign() {
  closeGameMenu();

  const G = window.G;
  const camp = window.campState;
