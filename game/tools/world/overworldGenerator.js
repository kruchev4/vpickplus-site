// src/world/overworldGenerator.js
console.log("✅ overworldGenerator.js executing");



export const WORLD_WIDTH  = 240;
export const WORLD_HEIGHT = 180;

// World → biome mapping
const OVERWORLD_BIOMES = {
  overworld_C:  "grass",
  overworld_N:  "mountain",
  overworld_S:  "blight",
  overworld_E:  "volcano",
  overworld_W:  "forest",
  overworld_NE: "eldritch",
  overworld_NW: "eldritch",
  overworld_SE: "jungle",
  overworld_SW: "jungle",
};

// Lightweight hash
function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function generateOverworldTiles({ worldId, seed }) {
  // ✅ FIRST translate world → biome
  const biomeKey = OVERWORLD_BIOMES[worldId];
  if (!biomeKey) {
    throw new Error(`Unknown worldId: ${worldId}`);
  }

  const biome = BIOMES[biomeKey];
  if (!biome) {
    throw new Error(`Unknown biome: ${biomeKey}`);
  }

  const tiles = new Array(WORLD_WIDTH * WORLD_HEIGHT);

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const idx = y * WORLD_WIDTH + x;
      const h = hash(x + seed, y + seed);

      let tile = biome.base;
      for (const [alt, chance] of biome.noise) {
        if (h < chance) {
          tile = alt;
          break;
        }
      }

      tiles[idx] = tile;
    }
  }

  return tiles;
}

// dev hook
window.__generateOverworldTiles = generateOverworldTiles;
globalThis.__generateOverworldTiles = generateOverworldTiles;
console.log("✅ exposed __generateOverworldTiles");
