import { supabase } from "./client.js";
import { GameMap }  from "../world/GameMap.js";

export async function loadMap(mapId) {
  console.log(`[mapLoader] Loading map: "${mapId}"…`);

  const { data, error } = await supabase
    .from("maps")
    .select("json")
    .eq("id", mapId)
    .maybeSingle();

  if (error) {
    console.error(`[mapLoader] Supabase error loading "${mapId}":`, error.message, error);
    // Surface a visible error in-game rather than hanging silently
    if (typeof toast === 'function') toast(`Map load failed: ${error.message}`, 'err');
    throw error;
export async function loadMap(mapJson) {
  if (!mapJson || typeof mapJson !== "object") {
    throw new Error("[mapLoader] Invalid map object");
  }

  if (!data || !data.json) {
    const msg = `[mapLoader] No map found with id="${mapId}". Check the maps table in Supabase.`;
    console.error(msg);
    if (typeof toast === 'function') toast(`Map not found: ${mapId}`, 'err');
    throw new Error(msg);
  // 🔴 HARD ASSERT — catches this bug immediately
  if (!Array.isArray(mapJson.tiles)) {
    console.error("[mapLoader] mapJson:", mapJson);
    throw new Error("[mapLoader] Map missing tiles array");
  }

  const json = typeof data.json === 'string' ? JSON.parse(data.json) : data.json;

  console.log(`[mapLoader] Loaded "${mapId}" — ${json.width}×${json.height}, ${json.tiles?.length} tiles`);

  // Inject the id if the stored JSON doesn't include it
  if (!json.id) json.id = mapId;
  // 🔴 HARD ASSERT — prevents silent corruption
  if (mapJson.tiles.length !== mapJson.width * mapJson.height) {
    throw new Error(
      `[mapLoader] Tile count mismatch: got ${mapJson.tiles.length}, expected ${mapJson.width * mapJson.height}`
    );
  }

  return new GameMap(json);
  return new GameMap(mapJson);
}
