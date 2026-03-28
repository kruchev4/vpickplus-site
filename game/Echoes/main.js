import { RACES } from "./engine/data/races.js";
window.RACES = RACES;
window.CLASSES = CLASSES;
import { loadMap } from "./engine/supabase/mapLoader.js";
import { GameState } from "./engine/state/GameState.js";
import { renderMap } from "./engine/render/renderer.js";
import { updateCamera } from "./engine/camera/camera.js";
import { tryMove } from "./engine/movement/movement.js";
import { playSound, toggleSound } from "./engine/audio/SoundEngine.js";

import { CLASSES } from "./engine/data/classes.js";
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
import {
  openCharSheet,
  closeCharSheet,
  populateCharSheet
} from "./ui/characterSheet.js";

import {
  openGameMenu,
  closeGameMenu,
  menuResume,
  //menuSave,
  menuShowSyncInfo,
  menuPauseCampaign,
  menuExitCampaign,
  menuReturnToWorld,
  menuNewChar
} from "./ui/gameMenu.js";

Object.assign(window, {
  openGameMenu,
  closeGameMenu,
  menuResume,
  menuSave,
  menuShowSyncInfo,
  menuPauseCampaign,
  menuExitCampaign,
  menuReturnToWorld,
  menuNewChar
});
import { menuSave } from "./ui/gameMenu.js";
import { renderMap } from "./engine/render/render.js";
import { GameState } from "./engine/state/GameState.js";


// Legacy bridge (temporary)
window.menuSave = menuSave;

// Temporary legacy bridge
window.openCharSheet = openCharSheet;
window.closeCharSheet = closeCharSheet;
window.populateCharSheet = populateCharSheet;


// Temporary legacy bridge
window.CRAFT_RECIPES = CRAFT_RECIPES;


// Temporary legacy bridge
window.TOWNS = TOWNS;

window.CLASS_ABILITIES = CLASS_ABILITIES;

window.LEGENDARY_ITEMS = LEGENDARY_ITEMS;
window.RARE_ITEMS = RARE_ITEMS;
window.UNCOMMON_LOOT = UNCOMMON_ITEMS;
// Legacy bridge — REMOVE later when UI is migrated
window.RACES = RACES;
window.CLASSES = CLASSES;

window.STAT_DEFS = STAT_DEFS;
window.MONSTERS = MONSTERS;



window.playSound = playSound;
window.toggleSound = toggleSound;
console.log("✅ main.js loaded");
console.log("RACES in main.js:", RACES);
// Legacy compatibility stub — REMOVE once HUD is migrated
window.worldMap = {
  width: GameState.activeMap?.width ?? 0,
  height: GameState.activeMap?.height ?? 0,
  getTile(x, y) {
    return null; // legacy HUD should not depend on tile data anymore
  },
};

let ctx;

async function initGame() {
  const canvas = document.getElementById("world-cv");

  if (!canvas) {
    throw new Error("❌ NO CANVAS with id='world-cv' found");
  }

  ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("❌ Failed to get 2D context");
  }

  console.log("[DEBUG] Canvas found:", canvas);
  console.log("[DEBUG] Canvas size:", canvas.width, canvas.height);

  GameState.camera.w = canvas.width;
  GameState.camera.h = canvas.height;

  GameState.activeMap = await loadMap("overworld_generated");

  setupInput();
  gameLoop();
}


function setupInput() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") tryMove(0, -1);
    if (e.key === "ArrowDown") tryMove(0, 1);
    if (e.key === "ArrowLeft") tryMove(-1, 0);
    if (e.key === "ArrowRight") tryMove(1, 0);
  });

  // Click-to-move handled separately
}

function gameLoop() {
  
  

  updateCamera();

 
  renderMap(
    ctx,
    GameState.activeMap,
    GameState.camera,
    [
      {
        x: GameState.player.x,
        y: GameState.player.y,
        color: "#ff00ff"
      }
    ]
  );
  // main.js
window.engineReady = true;
//console.log("✅ Engine ready");

 
  requestAnimationFrame(gameLoop);
}

initGame();
document.getElementById("canvas-wrap").style.display = "block";
