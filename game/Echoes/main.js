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

/* ===============================
  MULTIPLAYER (MultiEngine)
  =============================== */

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const multi = new MultiEngine(FIREBASE_CONFIG, window.G || {});
window.multi = multi;

multi.onPartyUpdate = (party) => {};

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

function resizeCanvasToDisplaySize(c) {
  const dpr = window.devicePixelRatio || 1;
  const w   = Math.floor(c.getBoundingClientRect().width  * dpr);
  const h   = Math.floor(c.getBoundingClientRect().height * dpr);
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
}

/* ===============================
  GAME LOOP
  =============================== */

function gameLoop(ts) {
  resizeCanvasToDisplaySize(canvas);

  // Keep camera dimensions in sync with actual canvas size
  GameState.camera.w = canvas.width;
  GameState.camera.h = canvas.height;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lastFrame = ts;

  updateCamera();

  if (GameState.activeMap && GameState.camera && GameState.player) {
    // Build entity list: player + alive world bosses
    const entities = [{
      x:   GameState.player.x,
      y:   GameState.player.y,
      cls: GameState.player.cls,
    }];
    const bosses = window.worldBosses;
    if (Array.isArray(bosses)) {
      for (const b of bosses) {
        if (b.alive) entities.push({ x: b.x, y: b.y, cls: 'boss', icon: b.icon, name: b.name, isBoss: true });
      }
    }
    renderMap(ctx, GameState.activeMap, GameState.camera, entities);
  }

  requestAnimationFrame(gameLoop);
}

/* ===============================
  ENGINE STARTUP
  =============================== */

async function startEngine() {
  // Always sync player to latest window.G
  if (window.G && window.G.name) GameState.player = window.G;
  if (window.multi) window.multi.G = window.G || GameState.player;

  if (engineRunning) {
    console.log("[startEngine] already running — player synced:", GameState.player?.name);
    return;
  }
  engineRunning = true;

  canvas = document.getElementById("world-cv");
  if (!canvas) throw new Error("Canvas #world-cv not found");

  ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to acquire 2D context");
  window._engineCtx = ctx;

  GameState.camera.w = canvas.width;
  GameState.camera.h = canvas.height;

  try {
    GameState.activeMap = await loadMap("overworld_generated");
  } catch(e) {
    console.error("[startEngine] Map load failed:", e.message);
  }

  if (GameState.activeMap) {
    window.worldMap.width  = GameState.activeMap.width;
    window.worldMap.height = GameState.activeMap.height;
    window.MAP_W = GameState.activeMap.width;
    window.MAP_H = GameState.activeMap.height;
  }

  setupInput(); // register WASD → engine tryMove

  window.engineReady = true;
  console.log("✅ Engine ready, player:", GameState.player?.name);

  requestAnimationFrame(gameLoop);
}

window.startEngine = startEngine;

/* ===============================
  INPUT (ENGINE-OWNED)
  =============================== */

function setupInput() {
  if (window._inputRegistered) return;
  window._inputRegistered = true;
  window.addEventListener("keydown", e => {
    // Delegate to echo.html's onKey which handles movement + UI shortcuts
    if (typeof window.onKey === 'function') window.onKey(e);
  });
}

/* ===============================
  MODULE READY SIGNAL
  =============================== */

window.dispatchEvent(new Event('module-ready'));
