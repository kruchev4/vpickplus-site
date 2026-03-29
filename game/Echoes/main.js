/* ===============================
  ENGINE BOOTSTRAP (MODULE)
  =============================== */

/* ---------- Engine Data ---------- */
import { RACES } from "./engine/data/races.js";
import { CLASSES } from "./engine/data/classes.js";
console.log("races imported - nope");

window.RACES = RACES;
window.CLASSES = CLASSES;

import { STAT_DEFS } from "./engine/data/stats.js";
import { MONSTERS } from "./engine/data/monsters.js";
import {
LEGENDARY_ITEMS,
RARE_ITEMS,
UNCOMMON_ITEMS
} from "./engine/data/loot.js";
import { CLASS_ABILITIES } from "./engine/data/abilities/classAbilities.js";
import { TOWNS } from "./engine/data/world/towns.js";
import { CRAFT_RECIPES } from "./engine/data/crafting/recipes.js";

/* ---------- Engine Core ---------- */
import { GameState } from "./engine/state/GameState.js";
import { loadMap } from "./engine/supabase/mapLoader.js";
import { renderMap } from "./engine/render/renderer.js";
import { updateCamera } from "./engine/camera/camera.js";
import { tryMove } from "./engine/movement/movement.js";
import { playSound, toggleSound } from "./engine/audio/SoundEngine.js";

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

/* --- UI bridges --- */
Object.assign(window, {
openGameMenu,
closeGameMenu,
menuResume,
menuSave,
menuShowSyncInfo,
menuPauseCampaign,
menuExitCampaign,
menuReturnToWorld,
menuNewChar,

openCharSheet,
closeCharSheet,
populateCharSheet,

playSound,
toggleSound
});

/* --- Data bridges --- */
Object.assign(window, {
RACES,
CLASSES,
STAT_DEFS,
MONSTERS,
CLASS_ABILITIES,
TOWNS,
CRAFT_RECIPES,
LEGENDARY_ITEMS,
RARE_ITEMS,
UNCOMMON_LOOT: UNCOMMON_ITEMS
});

/* Legacy HUD compatibility stub */
window.worldMap = {
width: 0,
height: 0,
getTile() {
return null;
}
};

/* ===============================
  CANVAS + ENGINE LOOP
  =============================== */

let canvas;
let ctx;
let engineRunning = false;
let lastFrame = 0;

/* Resize canvas buffer to match CSS */
function resizeCanvasToDisplaySize(canvas) {
const rect = canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio || 1;

const width = Math.floor(rect.width * dpr);
const height = Math.floor(rect.height * dpr);

if (canvas.width !== width || canvas.height !== height) {
canvas.width = width;
canvas.height = height;
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
renderMap(
ctx,
GameState.activeMap,
GameState.camera,
[{
x: GameState.player.x,
y: GameState.player.y,
color: "#ff00ff"
}]
);
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

GameState.activeMap = await loadMap("overworld_generated");

/* Legacy HUD info */
window.worldMap.width = GameState.activeMap.width;
window.worldMap.height = GameState.activeMap.height;

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
if (e.key === "ArrowUp") tryMove(0, -1);
if (e.key === "ArrowDown") tryMove(0, 1);
if (e.key === "ArrowLeft") tryMove(-1, 0);
if (e.key === "ArrowRight") tryMove(1, 0);
});
// main.js – last lines
window.__ENGINE_READY__ = true;
window.dispatchEvent(new Event("engine-ready"));
}
// ── multi-wiring-example.js ───────────────────────────────────────────────────
// Drop this into main.js (or a dedicated multi-init block).
// Shows exactly how to wire MultiEngine into the existing game.
// DELETE this file after wiring — it's a reference only.

import { MultiEngine } from './engine/multi/MultiEngine.js';
import { MSG }         from './engine/multi/syncProtocol.js';

// ── 1. Your Firebase config (same project as before) ─────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// ── 2. Create the engine (pass G — the live game state object) ────────────────
const multi = new MultiEngine(FIREBASE_CONFIG, G);

// ── 3. Wire callbacks ─────────────────────────────────────────────────────────

// Called whenever party membership or vitals change
multi.onPartyUpdate = (party) => {
  // The engine already calls renderLobbyList() and renderHUD() internally.
  // Put any extra game-side logic here — e.g. render peer sprites on the map.
  renderPeerSprites(party);   // your existing function
};

// Called for every inbound message type
multi.onData = (type, data) => {
  switch (type) {
    case MSG.WELCOME:
      // World snapshot arrived — position host on our minimap, etc.
      if (data.worldState?.hostX) {
        G.x = data.worldState.hostX;
        G.y = data.worldState.hostY;
      }
      break;

    case MSG.WORLD_SYNC:
      // Peer positions already updated in party array by engine.
      // Just trigger a map redraw if needed.
      requestRedraw?.();
      break;

    case MSG.PLAYER_MOVE:
      // A peer moved — map already updated, just redraw.
      requestRedraw?.();
      break;

    case MSG.COMBAT_START:
      startCombat(data.enemies);   // your existing function
      break;

    case MSG.COMBAT_ACTION:
      handlePeerCombatAction(data);
      break;

    case MSG.CHAT:
      addLog(`${data.name}: ${data.text}`, 'chat');
      break;

    case MSG.DUNGEON_INVITE:
      showDungeonInvitePopup(data);
      break;

    case MSG.START_CAMPAIGN:
      window.location.href = data.url;
      break;
  }
};

// Called to update lobby status UI
multi.onStatusChange = (role, level, html) => {
  setCoopStatus(role, level, html);   // your existing function
};

// Called to append a line to the game log
multi.onLog = (text, tag) => {
  addLog(text, tag);   // your existing function
};

// ── 4. Wire UI buttons ────────────────────────────────────────────────────────

// Host button
document.getElementById('coop-host-btn')?.addEventListener('click', async () => {
  if (!G.cls || !G.name) { toast('Create your character first!', 'err'); return; }
  const code = await multi.host();
  document.getElementById('coop-room-code').textContent = code;
  document.getElementById('coop-host-panel').classList.add('open');
});

// Join button
document.getElementById('coop-join-btn')?.addEventListener('click', async () => {
  if (!G.cls || !G.name) { toast('Create your character first!', 'err'); return; }
  const code = document.getElementById('coop-join-input').value.trim();
  await multi.join(code);
});

// Disconnect / leave party
document.getElementById('coop-leave-btn')?.addEventListener('click', () => {
  multi.disconnect();
  closeCoopLobby();
});

// ── 5. Broadcasting from game systems ─────────────────────────────────────────

// When the local player moves:
function onLocalPlayerMoved(x, y) {
  if (multi.active) {
    multi.broadcast({ type: MSG.PLAYER_MOVE, partyIdx: multi.myPartyIdx, x, y });
  }
}

// When local player's vitals change (combat, healing, etc.):
function onLocalPlayerStatChanged() {
  if (multi.active) {
    multi.broadcast({
      type:     MSG.PLAYER_STAT,
      partyIdx: multi.myPartyIdx,
      hp:       G.hp,
      hpMax:    G.hpMax,
      mp:       G.mp,
      mpMax:    G.mpMax,
    });
  }
}

// When host starts a dungeon campaign:
function onHostStartCampaign(url) {
  if (multi.active && multi.isHost) {
    multi.broadcast({ type: MSG.START_CAMPAIGN, url });
  }
  window.location.href = url;
}

// When host starts combat:
function onHostStartCombat(enemies) {
  if (multi.active && multi.isHost) {
    multi.broadcast({ type: MSG.COMBAT_START, enemies });
  }
  startCombat(enemies);
}

// Chat message from local player:
function onLocalChat(text) {
  const msg = { type: MSG.CHAT, name: G.name, text };
  if (multi.active) multi.broadcast(msg);
  addLog(`${G.name}: ${text}`, 'chat');
}

// ── 6. Export multi so other modules can use it ───────────────────────────────
export { multi };

/* ===============================
  EXPOSE ENGINE START
