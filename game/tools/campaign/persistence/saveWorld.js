// campaign/persistence/saveWorld.js
import { supabase } from "./supabaseClient.js";

export async function saveWorldToSupabase(world) {
  // assuming table "worlds" with columns:
  // id (text), name (text), map_json (jsonb), created_at (timestamp)
  const { data, error } = await supabase
    .from("worlds")
    .upsert({
      id: world.id,
      name: world.name,
      map_json: world
    }, { onConflict: "id" });

  if (error) throw error;
  return data;
}
