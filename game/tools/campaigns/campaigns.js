import { generateEightDungeons } from "../../campaign/generator/generateEightDungeons.js";
import { saveDungeonToSupabase } from "../../campaign/persistence/saveDungeon.js";

const generateBtn = document.getElementById("generate");
const list = document.getElementById("dungeon-list");

generateBtn.onclick = async () => {
  list.innerHTML = "";

  const seed = document.getElementById("seed").value;
  const count = Number(document.getElementById("count").value);

  // MVP: still uses your fixed generator
  // Later: pass dynamic options
  const dungeons = generateEightDungeons(seed);

  for (const dungeon of dungeons) {
    await saveDungeonToSupabase(dungeon);
    renderDungeon(dungeon);
  }
};

function renderDungeon(dungeon) {
  const li = document.createElement("li");

  li.innerHTML = `
    <strong>${dungeon.name}</strong><br/>
    Type: ${dungeon.type}<br/>
    Size: ${dungeon.width} x ${dungeon.height}<br/>
    Loot Tier: ${dungeon.lootTier}<br/>
    Rooms: ${dungeon.rooms.length}<br/>
  `;

  list.appendChild(li);
}
