import { loadWorld } from "../engine/supabase/worldLoader.js";
import { WORLD_NEIGHBORS } from "../world/worldNeighbors.js";

async function transitionWorldEdge(dir) {
  const GS  = window.GameState;
  const G   = window.G;
  if (!GS || !G) return false;

  const current = GS.currentWorldId || "overworld_C";
  const nextId  = WORLD_NEIGHBORS[current]?.[dir];
  if (!nextId) return false;
  if (GS._transitioning) return true;
  GS._transitioning = true;

  try {
    const nextMap = await window.loadWorld(nextId);

    // Always assign through window.GameState — the module-imported
    // GameState reference may differ from what the renderer reads
    window.GameState.activeMap      = nextMap;
    window.GameState.currentWorldId = nextId;
    window.MAP_W = nextMap.width;
    window.MAP_H = nextMap.height;

    if (window.worldMap) {
      window.worldMap.width  = nextMap.width;
      window.worldMap.height = nextMap.height;
    }

    // Wrap player to opposite edge
    if (dir === "N")  { window.G.y = nextMap.height - 1; }
    if (dir === "S")  { window.G.y = 0; }
    if (dir === "W")  { window.G.x = nextMap.width  - 1; }
    if (dir === "E")  { window.G.x = 0; }
    if (dir === "NW") { window.G.x = nextMap.width  - 1; window.G.y = nextMap.height - 1; }
    if (dir === "NE") { window.G.x = 0;                  window.G.y = nextMap.height - 1; }
    if (dir === "SW") { window.G.x = nextMap.width  - 1; window.G.y = 0; }
    if (dir === "SE") { window.G.x = 0;                  window.G.y = 0; }

    window.GameState.player = window.G;

    if (typeof addLog    === "function") addLog(`You enter ${nextId.replace("overworld_", "").replace(/_/g, " ")}.`);
    if (typeof render    === "function") render();
    if (typeof updateHUD === "function") updateHUD();
    return true;

  } catch (e) {
    console.error("[transitionWorldEdge] failed:", e);
    if (typeof toast === "function") toast(`World transition failed: ${e.message}`, "err");
    return false;

  } finally {
    window.GameState._transitioning = false;
  }
}

export { transitionWorldEdge };
window.transitionWorldEdge = transitionWorldEdge;
