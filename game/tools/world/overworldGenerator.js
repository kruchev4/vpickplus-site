// src/world/overworldGenerator.js
console.log("✅ overworldGenerator.js executing");

import { BIOMES } from "./biomes.js";


export const WORLD_WIDTH  = 240;
export const WORLD_HEIGHT = 180;

export function generateOverworldTiles({ biomeKey, seed }) {
  const biome = BIOMES[biomeKey];
  if (!biome) {
    throw new Error(`Unknown biome: ${biomeKey}`);
  }
console.log("✅ about to expose generateOverworldTiles");
window.__generateOverworldTiles = generateOverworldTiles;
  
  // Lightweight deterministic hash for world generation
function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
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
