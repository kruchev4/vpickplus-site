/* ===============================
  ENGINE BOOTSTRAP (MODULE)
  =============================== */

/* ---------- Engine Data ---------- */
import { RACES }   from "./engine/data/races.js";
import { CLASSES } from "./engine/data/classes.js";

window.RACES   = RACES;
window.CLASSES = CLASSES;

import { STAT_DEFS }                        from "./engine/data/stats.js";
import { MONSTERS }                         from "./engine/data/monsters.js";
import { LEGENDARY_ITEMS, RARE_ITEMS, UNCOMMON_ITEMS } from "./engine/data/loot.js";
import { CLASS_ABILITIES }                  from "./engine/data/abilities/classAbilities.js";
import { TOWNS }                            from "./engine/data/world/towns.js";
import { CRAFT_RECIPES }                    from "./engine/data/crafting/recipes.js";

/* ---------- Engine Core ---------- */
import { GameState }    from "./engine/state/GameState.js";
import { loadMap }      from "./engine/supabase/mapLoader.js";
import { renderMap }    from "./engine/render/renderer.js";
import { updateCamera } from "./engine/camera/camera.js";
import { tryMove }      from "./engine/movement/movement.js";
import { playSound, toggleSound } from "./engine/audio/SoundEngine.js";

/* ---------- Multiplayer ---------- */
import { MultiEngine } from "./engine/multi/MultiEngine.js";
import { MSG }         from "./engine/multi/syncProtocol.js";

/* ---------- UI Modules ---------- */
import {
  openCharSheet,
  closeCharSheet,
  populateCharSheet
} from "./ui/characterSheet.js";

import {
  openGameMenu,
  closeGameMenu,
  menuResume,
  menuSave,
  menuShowSyncInfo,
  menuPauseCampaign,
  menuExitCampaign,
  menuReturnToWorld,
  menuNewChar
} from "./ui/gameMenu.js";

/* ===============================
  LEGACY GLOBAL BRIDGES (INTENTIONAL)
  =============================== */

Object.assign(window, {
  openGameMenu, closeGameMenu, menuResume, menuSave,
  menuShowSyncInfo, menuPauseCampaign, menuExitCampaign,
  menuReturnToWorld, menuNewChar,
  openCharSheet, closeCharSheet, populateCharSheet,
  playSound, toggleSound,
});

Object.assign(window, {
  RACES, CLASSES, STAT_DEFS, MONSTERS, CLASS_ABILITIES,
  TOWNS, CRAFT_RECIPES,
  LEGENDARY_ITEMS, RARE_ITEMS,
  UNCOMMON_LOOT: UNCOMMON_ITEMS,
});

/* Legacy HUD compatibility stub */
window.worldMap = { width: 0, height: 0, getTile() { return null; } };

// Signal that all ES module imports (RACES, CLASSES, etc.) are resolved.
// echoes.html listens for this before calling showCharSelect().
window.dispatchEvent(new Event('module-ready'));

/* ===============================
  MULTIPLAYER (MultiEngine)
  =============================== */

// ── Firebase config ───────────────────────────────────────────────────────────
// NOTE: Firebase SDK is loaded via <script> tags in echoes.html (compat build).
// MultiEngine.init() will call firebase.initializeApp() using this config.
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// Create engine — G is set as window.G by echoes.html before startEngine() runs
const multi = new MultiEngine(FIREBASE_CONFIG, window.G || {});
window.multi = multi; // expose globally so echoes.html shims can reach it

// ── Callbacks ─────────────────────────────────────────────────────────────────

multi.onPartyUpdate = (party) => {
  // renderLobbyList() + renderHUD() are called internally by the engine.
  // Add any extra game-side reactions here (e.g. peer sprites on map).
};

multi.onData = (type, data) => {
  switch (type) {
    case MSG.WELCOME:
      if (data.worldState?.hostX && window.G) {
        window.G.x = data.worldState.hostX;
        window.G.y = data.worldState.hostY;
      }
      break;

    case MSG.WORLD_SYNC:
    case MSG.PLAYER_MOVE:
      // Positions updated in party array by engine — just redraw
      break;

    case MSG.COMBAT_START:
      if (typeof startCombat === 'function') startCombat(data.enemies);
      break;

    case MSG.CHAT:
      if (typeof addLog === 'function') addLog(`${data.name}: ${data.text}`, 'chat');
      break;

    case MSG.DUNGEON_INVITE:
      if (typeof showDungeonInvitePopup === 'function') showDungeonInvitePopup(data);
      break;

    case MSG.START_CAMPAIGN:
      window.location.href = data.url;
      break;
  }
};

multi.onStatusChange = (role, level, html) => {
  if (typeof setCoopStatus === 'function') setCoopStatus(role, level, html);
};

multi.onLog = (text, tag) => {
  if (typeof addLog === 'function') addLog(text, tag);
};

// ── Lobby UI wiring ───────────────────────────────────────────────────────────
// The lobby buttons in echoes.html call coopStartHost() / coopJoin() /
// coopDisconnect() — those are shimmed in echoes.html to call multi directly.
// Nothing extra needed here unless you add new UI elements.

// ── Game-system broadcast helpers (call these from echoes.html game code) ─────
window.multiOnPlayerMoved = (x, y) => {
  if (multi.active) {
    multi.broadcast({ type: MSG.PLAYER_MOVE, partyIdx: multi.myPartyIdx, x, y });
  }
};

window.multiOnStatChanged = () => {
  if (!multi.active || !window.G) return;
  multi.broadcast({
    type: MSG.PLAYER_STAT, partyIdx: multi.myPartyIdx,
    hp: window.G.hp, hpMax: window.G.hpMax,
    mp: window.G.mp, mpMax: window.G.mpMax,
  });
};

window.multiStartCampaign = (url) => {
  if (multi.active && multi.isHost) multi.broadcast({ type: MSG.START_CAMPAIGN, url });
  window.location.href = url;
};

window.multiStartCombat = (enemies) => {
  if (multi.active && multi.isHost) multi.broadcast({ type: MSG.COMBAT_START, enemies });
  if (typeof startCombat === 'function') startCombat(enemies);
};

/* ===============================
  CANVAS + ENGINE LOOP
  =============================== */

let canvas;
let ctx;
let engineRunning = false;
let lastFrame = 0;

function resizeCanvasToDisplaySize(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  const w    = Math.floor(rect.width  * dpr);
  const h    = Math.floor(rect.height * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width  = w;
    canvas.height = h;
    return true;
  }
  return false;
}

/* ===============================
  GAME LOOP (SOLE RAF OWNER)
  =============================== */

function gameLoop(ts) {
  resizeCanvasToDisplaySize(canvas);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dt = Math.min(ts - lastFrame, 250);
  lastFrame = ts;

  updateCamera();

  if (GameState.activeMap && GameState.camera && GameState.player) {
    renderMap(ctx, GameState.activeMap, GameState.camera, [{
      x: GameState.player.x,
      y: GameState.player.y,
      color: "#ff00ff",
    }]);
  }

  requestAnimationFrame(gameLoop);
}

/* ===============================
  ENGINE STARTUP
  =============================== */

async function startEngine() {
  if (engineRunning) return;
  engineRunning = true;

  canvas = document.getElementById("world-cv");
  if (!canvas) throw new Error("Canvas #world-cv not found");

  ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to acquire 2D context");

  GameState.camera.w = canvas.width;
  GameState.camera.h = canvas.height;

  // Sync GameState.player to window.G — single source of truth for all game code.
  // startGame() / csLoadCharacter() set window.G before calling startEngine().
  if (window.G && window.G.name) {
    GameState.player = window.G;
  }
  if (window.multi) window.multi.G = window.G || GameState.player;

  try {
    GameState.activeMap = await loadMap("overworld_generated");
  } catch (e) {
    console.error("[startEngine] Map load failed — canvas will be blank:", e.message);
    // Don't rethrow — game loop still runs, toast shown by mapLoader
  }

  if (GameState.activeMap) {
    window.worldMap.width  = GameState.activeMap.width;
    window.worldMap.height = GameState.activeMap.height;
    window.MAP_W = GameState.activeMap.width;
    window.MAP_H = GameState.activeMap.height;
  }

  setupInput();

  window.engineReady = true;
  console.log("✅ Engine ready");

  requestAnimationFrame(gameLoop);
}

/* ===============================
  INPUT (ENGINE-OWNED)
  =============================== */

function setupInput() {
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") tryMove(0, -1);
    if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") tryMove(0,  1);
    if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") tryMove(-1, 0);
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") tryMove(1,  0);
  });

  window.__ENGINE_READY__ = true;
  window.dispatchEvent(new Event("engine-ready"));
}

/* ===============================
  EXPOSE ENGINE START
  =============================== */

window.startEngine = startEngine;
