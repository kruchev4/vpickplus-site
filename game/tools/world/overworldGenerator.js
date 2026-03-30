// ─────────────────────────────────────────────────────────────
// Overworld Generator (Standalone / Console-Friendly)
// No imports, classic script compatible
// ─────────────────────────────────────────────────────────────

console.log("✅ overworldGenerator.js executing");

// ── Constants ────────────────────────────────────────────────
const WORLD_WIDTH  = 240;
const WORLD_HEIGHT = 180;

// Tile IDs (must match your renderer switch)
const TILE = {
  GRASS:    0,
  FOREST:   1,
  MOUNTAIN: 2,
  DEEP:     3,
  SHALLOW:  4,
  TOWN:     5,
  DANGER:   6,
  SAND:     7,

  JUNGLE:   15,
  VOLCANO:  16,
  ELDRITCH: 17,
  OBSIDIAN: 18,
  BLIGHT:   19
};

// ── Lightweight deterministic hash ──────────────────────────
// (matches the style already used in your renderer)
function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// ── Biomes (INLINE – no imports) ─────────────────────────────
const BIOMES = {
  grass: {
    base: TILE.GRASS,
    noise: [
      [TILE.FOREST, 0.25],
      [TILE.SAND,   0.08],
      [TILE.DANGER, 0.05]
    ]
  },

  forest: {
    base: TILE.FOREST,
    noise: [
      [TILE.GRASS,  0.15],
      [TILE.DANGER, 0.12]
    ]
  },

  mountain: {
    base: TILE.MOUNTAIN,
    noise: [
      [TILE.ELDRITCH, 0.30],
      [TILE.DANGER,   0.10]
    ]
  },

  jungle: {
    base: TILE.JUNGLE,
    noise: [
      [TILE.DANGER,  0.18],
      [TILE.SHALLOW, 0.10]
    ]
  },

  blight: {
    base: TILE.BLIGHT,
    noise: [
      [TILE.DANGER,  0.30],
      [TILE.SHALLOW, 0.20]
    ]
  },

  volcano: {
    base: TILE.OBSIDIAN,
    noise: [
      [TILE.VOLCANO, 0.35],
      [TILE.DANGER,  0.20]
    ]
  },

  eldritch: {
    base: TILE.ELDRITCH,
    noise: [
      [TILE.DANGER, 0.25]
    ]
  }
};

// ── World → Biome mapping ────────────────────────────────────
const OVERWORLD_BIOMES = {
  overworld_C:  "grass",

  overworld_N:  "mountain",
  overworld_S:  "blight",
  overworld_E:  "volcano",
  overworld_W:  "forest",

  overworld_NE: "eldritch",
  overworld_NW: "eldritch",
  overworld_SE: "jungle",
  overworld_SW: "jungle"
};

// ── Generator ────────────────────────────────────────────────
function generateOverworldTiles({ worldId, seed }) {
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
      const i = y * WORLD_WIDTH + x;
      const h = hash(x + seed, y + seed);

      let t = biome.base;
      for (const [alt, chance] of biome.noise) {
        if (h < chance) {
          t = alt;
          break;
        }
      }

      tiles[i] = t;
    }
  }

  return tiles;
}

// ── DEV / CONSOLE HOOK ───────────────────────────────────────
window.__generateOverworldTiles = generateOverworldTiles;
globalThis.__generateOverworldTiles = generateOverworldTiles;

console.log("✅ __generateOverworldTiles exposed to window");
