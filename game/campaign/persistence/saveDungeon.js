// campaign/persistence/saveDungeon.js
import { supabase } from "../../Echo/engine/supabase/client.js";

export async function saveDungeonToSupabase(dungeon) {
  const { data, error } = await supabase
    .from("maps")
    .upsert(
      {
        id: dungeon.id,
        name: dungeon.name ?? dungeon.id,
        type: "dungeon",
        width: dungeon.width,
        height: dungeon.height,
        json: dungeon
      },
      { onConflict: "id" }
    );

  if (error) throw error;
  return data;
}
