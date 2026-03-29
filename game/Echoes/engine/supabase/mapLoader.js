import { supabase } from "./client.js";
import { GameMap }  from "../world/GameMap.js";

export async function loadMap(mapJson) {
  if (!mapJson || typeof mapJson !== "object") {
    throw new Error("[mapLoader] Invalid map object");
  }

  // 🔴 HARD ASSERT — catches this bug immediately
  if (!Array.isArray(mapJson.tiles)) {
    console.error("[mapLoader] mapJson:", mapJson);
    throw new Error("[mapLoader] Map missing tiles array");
  }

  // 🔴 HARD ASSERT — prevents silent corruption
  if (mapJson.tiles.length !== mapJson.width * mapJson.height) {
    throw new Error(
      `[mapLoader] Tile count mismatch: got ${mapJson.tiles.length}, expected ${mapJson.width * mapJson.height}`
    );
  }

  return new GameMap(mapJson);
}
