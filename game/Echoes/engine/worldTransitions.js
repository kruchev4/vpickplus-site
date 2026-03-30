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

window.transitionWorldEdge = async function transitionWorldEdge(dir) {
  const GS = window.GameState;
  if (!GS) return false;

  if (GS._transitioning) return true;

  const curId = GS.currentWorldId || "overworld_C";
  const nextId = (window.WORLD_NEIGHBORS?.[curId] || {})[dir];

  if (!nextId) {
    console.warn("[transition] no neighbor", { curId, dir });
    return false;
  }

  if (typeof window.loadWorld !== "function") {
    console.error("[transition] window.loadWorld is not defined");
    return false;
  }

  GS._transitioning = true;

  try {
    console.log("[transition] loading world", { from: curId, dir, to: nextId });

    // ✅ Load from WORLDS table via exposed loader
    const nextMap = await window.loadWorld(nextId);

    // Swap active map + world id
    GS.activeMap = nextMap;
    GS.currentWorldId = nextId;

    // Update globals used by renderer/minimap
    window.MAP_W = nextMap.width;
    window.MAP_H = nextMap.height;
    if (window.worldMap) {
      window.worldMap.width  = nextMap.width;
      window.worldMap.height = nextMap.height;
    }

    // Wrap player to opposite edge
    if (dir === "W") G.x = nextMap.width - 1;
    if (dir === "E") G.x = 0;
    if (dir === "N") G.y = nextMap.height - 1;
    if (dir === "S") G.y = 0;

    GS.player = G;

    if (typeof addLog === "function") addLog(`You enter ${nextId.replace("overworld_", "")}.`);
    render(); updateHUD();
    return true;

  } catch (e) {
    console.error("[transition] failed:", e);
    if (typeof toast === "function") toast(`World transition failed: ${e.message}`, "err");
    return false;

  } finally {
    GS._transitioning = false;
  }
};

