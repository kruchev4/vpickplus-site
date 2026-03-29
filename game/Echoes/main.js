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
