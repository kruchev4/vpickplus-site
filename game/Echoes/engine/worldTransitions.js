// game/Echoes/engine/worldTransitions.js
import { loadWorld } from "../engine/supabase/worldLoader.js";
import { WORLD_NEIGHBORS } from "../world/worldNeighbors.js";

function syncMapGlobals(map) {
  window.MAP_W = map.width;
  window.MAP_H = map.height;

  if (window.worldMap) {
    window.worldMap.width  = map.width;
    window.worldMap.height = map.height;
  }
}

export async function transitionWorld(dir) {
  if (GameState._transitioning) return false;
  GameState._transitioning = true;

  try {
    const currentId = GameState.currentWorldId || "overworld_C";
    const nextId = WORLD_NEIGHBORS[currentId]?.[dir];

    if (!nextId) {
      // No neighbor defined for this direction (edge of your 3×3)
      if (typeof addLog === "function") addLog("You cannot travel further that way.");
      return false;
    }

    const nextMap = await loadWorld(nextId);

    // Wrap player coordinates to the opposite edge
    if (dir === "W") GameState.player.x = nextMap.width - 1;
    if (dir === "E") GameState.player.x = 0;
    if (dir === "N") GameState.player.y = nextMap.height - 1;
    if (dir === "S") GameState.player.y = 0;

    GameState.activeMap = nextMap;
    GameState.currentWorldId = nextId;

    syncMapGlobals(nextMap);

    if (typeof addLog === "function") {
      addLog(`You enter ${nextId.replace("overworld_", "")}.`);
    }

    // Optional: clear/rebuild minimap/fog if you have per-map state
    if (typeof updateMinimapMode === "function") updateMinimapMode();
    if (typeof render === "function") render();
    if (typeof updateHUD === "function") updateHUD();

    return true;
  } catch (e) {
    console.error("[transitionWorld] failed:", e);
    if (typeof toast === "function") toast(`World load failed: ${e.message}`, "err");
    return false;
  } finally {
    GameState._transitioning = false;
  }
}
