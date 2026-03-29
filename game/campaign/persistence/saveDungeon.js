// campaign/persistence/saveDungeon.js
import { supabase } from "../../Echoes/engine/supabase/client.js";

export async function saveDungeonToSupabase(dungeon) {
  const { data, error } = await supabase
    .from("dungeons")
    .upsert(
      {
        id: dungeon.id,
        name: dungeon.name,
        map_json: dungeon
      },
      { onConflict: "id" }
    );

  if (error) throw error;
  return data;
}
