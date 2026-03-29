// campaign/persistence/saveDungeon.js
import { supabase } from "../../Echoes/engine/supabase/client.js";

export async function saveDungeonToSupabase(dungeon) {
  const { data, error } = await supabase
    .from("dungeon_instances")
    .upsert(
      {
        id: dungeon.id,

        // required by schema
        type: dungeon.type ?? "world",
        width: dungeon.width ?? 240,
        height: dungeon.height ?? 180,

        // jsonb column that actually exists
        data: dungeon
      },
      { onConflict: "id" }
    );

  if (error) throw error;
  return data;
}
``
