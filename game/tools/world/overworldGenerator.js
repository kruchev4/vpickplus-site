// game/tools/world/overworldGenerator.js
// Phase 1 Overworld Generator (3×3), aligned to YOUR renderer IDs
// - World tiles: 0..9
// - Dungeon tiles: 10..15 (unused here)
// - Town tiles: 20..26 (unused here)
// - Road tiles: 27..31
//
// Exposes:
//   export function generateOverworldTiles({ worldId, seed })
//   export function generateOverworldWorld({ worldId, seed })
//   window.__generateOverworldWorld / window.__generateOverworldTiles (dev hooks)

export const WORLD_WIDTH  = 240;
export const WORLD_HEIGHT = 180;

// ── Tile IDs (MUST match your renderer switch) ──────────────────────────────
export const TILE = {
  // World tiles (0..9)
  GRASS: 0,
  FOREST: 1,
  MOUNTAIN: 2,
  DEEP_WATER: 3,
  SHALLOW: 4,
  TOWN: 5,
  SAND: 6,     // renderer case 6 drawSand
  DANGER: 7,   // renderer case 7 drawDanger
  BLIGHT: 8,   // renderer case 8 drawBlight
  VOLCANO: 9,  // renderer case 9 drawVolcano

  // Roads (you added)
  ROAD_DIRT: 27,
  ROAD_STONE: 28,
  ROAD_OBSIDIAN: 29,
  ROAD_BLIGHT: 30,
  ROAD_RUNIC: 31
};

// 3×3 world offsets for edge-consistent features
const WORLD_OFFSETS = {
  overworld_C:[0,0],
  overworld_N:[0,-1],
  overworld_S:[0,1],
  overworld_E:[1,0],
  overworld_W:[-1,0],
  overworld_NE:[1,-1],
  overworld_NW:[-1,-1],
  overworld_SE:[1,1],
  overworld_SW:[-1,1]
};

// ── Deterministic noise helpers ─────────────────────────────────────────────
function hash01(x, y, seed) {
  const s = Math.sin((x * 127.1 + y * 311.7 + seed * 17.17)) * 43758.5453;
  return s - Math.floor(s);
}
function smoothstep(t){ return t*t*(3-2*t); }
function lerp(a,b,t){ return a+(b-a)*t; }

function noise2(x, y, seed, scale=32) {
  const fx = x / scale;
  const fy = y / scale;
  const x0 = Math.floor(fx), y0 = Math.floor(fy);
  const tx = smoothstep(fx - x0);
  const ty = smoothstep(fy - y0);

  const a = hash01(x0,   y0,   seed);
  const b = hash01(x0+1, y0,   seed);
  const c = hash01(x0,   y0+1, seed);
  const d = hash01(x0+1, y0+1, seed);

  return lerp(lerp(a,b,tx), lerp(c,d,tx), ty);
}

function idx(x,y,W){ return y*W+x; }
function inb(x,y,W,H){ return x>=0 && y>=0 && x<W && y<H; }

// ── Base biome definition per world (Phase 1, renderer-aligned) ────────────
// Keep it simple: only use tiles 0..9 + roads 27..31.
// You can later add real biome tiles (15..19) in Phase 2 AFTER renderer supports them.
const BIOME = {
  overworld_C: { base: TILE.GRASS,  alts: [[TILE.FOREST, 0.28], [TILE.SAND, 0.06], [TILE.DANGER, 0.04]] },
  overworld_N: { base: TILE.MOUNTAIN, alts: [[TILE.FOREST, 0.10], [TILE.DANGER, 0.06]] },
  overworld_S: { base: TILE.BLIGHT, alts: [[TILE.DANGER, 0.22], [TILE.FOREST, 0.06]] },
  overworld_E: { base: TILE.VOLCANO, alts: [[TILE.DANGER, 0.18], [TILE.SAND, 0.05]] },
  overworld_W: { base: TILE.FOREST, alts: [[TILE.GRASS, 0.12], [TILE.DANGER, 0.10]] },

  // Corners: distinct mixes without new tile IDs
  overworld_NE:{ base: TILE.DANGER, alts: [[TILE.MOUNTAIN, 0.14], [TILE.VOLCANO, 0.07]] },
  overworld_NW:{ base: TILE.FOREST, alts: [[TILE.MOUNTAIN, 0.12], [TILE.GRASS, 0.10]] },
  overworld_SE:{ base: TILE.GRASS,  alts: [[TILE.SAND, 0.10], [TILE.VOLCANO, 0.06], [TILE.DANGER, 0.06]] },
  overworld_SW:{ base: TILE.BLIGHT, alts: [[TILE.FOREST, 0.10], [TILE.DANGER, 0.16]] }
};

// ───────────────────────────────────────────────────────────────────────────
// 1) Base tiles (blank slate biome fill)
// ───────────────────────────────────────────────────────────────────────────
export function generateOverworldTiles({ worldId, seed }) {
  const W = WORLD_WIDTH, H = WORLD_HEIGHT;
  const def = BIOME[worldId] || BIOME.overworld_C;

  const tiles = new Array(W * H);

  // Use global-space noise so worlds are continuous across borders
  const [wx, wy] = WORLD_OFFSETS[worldId] || [0,0];
  const ox = wx * W;
  const oy = wy * H;

  for (let y=0; y<H; y++){
    for (let x=0; x<W; x++){
      const i = idx(x,y,W);

