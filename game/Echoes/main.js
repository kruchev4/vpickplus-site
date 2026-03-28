import { loadMap } from "./engine/supabase/mapLoader.js";
import { GameState } from "./engine/state/GameState.js";
import { renderMap } from "./engine/render/renderer.js";
import { updateCamera } from "./engine/camera/camera.js";
import { tryMove } from "./engine/movement/movement.js";
import { playSound, toggleSound } from "./engine/audio/SoundEngine.js";
import { RACES } from "./engine/data/races.js";
import { CLASSES } from "./engine/data/classes.js";
import { STAT_DEFS } from "./engine/data/stats.js";
import { MONSTERS } from "./engine/data/monsters.js";
import {
  LEGENDARY_ITEMS,
  RARE_ITEMS,
  UNCOMMON_ITEMS
} from "./engine/data/loot.js";

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
  console.log(
  "[CAMERA]",
  GameState.camera.x,
  GameState.camera.y,
  GameState.camera.w,
  GameState.camera.h
);
  

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

 
  requestAnimationFrame(gameLoop);
}

initGame();
document.getElementById("canvas-wrap").style.display = "block";
