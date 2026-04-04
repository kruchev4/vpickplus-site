import { supabase } from "./client.js";
import { GameMap }  from "../world/GameMap.js";

export async function loadWorld(worldId) {
  console.log(`[worldLoader] Loading world: "${worldId}"…`);

  const { data, error } = await supabase
    .from("worlds")
    .select("json")
    .eq("id", worldId)
    .maybeSingle();

  if (error) {
    console.error(`[worldLoader] Supabase error loading "${worldId}":`, error.message, error);
    if (typeof toast === 'function') toast(`World load failed: ${error.message}`, 'err');
    throw error;
  }

  if (!data || !data.map_json) {
    const msg = `[worldLoader] No world found with id="${worldId}". Check the worlds table in Supabase.`;
    console.error(msg);
    if (typeof toast === 'function') toast(`World not found: ${worldId}`, 'err');
    throw new Error(msg);
  }

  const json = typeof data.map_json === 'string'
    ? JSON.parse(data.map_json)
    : data.map_json;

  console.log(
    `[worldLoader] Loaded "${worldId}" — ${json.width}×${json.height}, ${json.tiles?.length} tiles`
  );

  if (!json.id) json.id = worldId;
  const map = new GameMap(json);
  window.GameState.activeMap = map;
  window.MAP_W = map.width;
  window.MAP_H = map.height;
  if (window.worldMap) {
    window.worldMap.width  = map.width;
    window.worldMap.height = map.height;
  }
  return map;
}
window.loadWorld = loadWorld;
