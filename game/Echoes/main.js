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

/* ===============================
   EXPOSE ENGINE START
   =============================== */

window.startEngine = startEngine;

console.log("✅ main.js loaded");
