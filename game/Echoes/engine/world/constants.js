// game/engine/world/constants.js

export const TILE = {
  GRASS:      0,
  FOREST:     1,
  MOUNTAIN:   2,
  DEEP_WATER: 3,
  SHALLOW:    4,
  TOWN:       5,
  DANGER:     6,
  SAND:       7,
  // Dungeon tiles
  WALL:       8,
  FLOOR:      9,
  DOOR:       10,
  CHEST:      11,
  STAIRS_UP:  12,
  STAIRS_DOWN:13,
  PORTAL:     14,
};

// Each entry: [base color, optional highlight color]
// base color is what fills the tile
// highlight is used for variant rendering (future)
export const TILE_COLORS = {
  // ── World tiles ───────────────────────────────────────────────────────────
  [TILE.GRASS]:      ["#3a6b30", "#4a8a3a"],  // green grasslands
  [TILE.FOREST]:     ["#1e4a1a", "#2a5e20"],  // dark forest
  [TILE.MOUNTAIN]:   ["#5a4e3a", "#6a5e4a"],  // grey-brown mountains
  [TILE.DEEP_WATER]: ["#1a3f6b", "#1e4a80"],  // deep blue water
  [TILE.SHALLOW]:    ["#2a6080", "#3a7090"],  // lighter shallow water
  [TILE.TOWN]:       ["#c9a227", "#d4b040"],  // gold town marker
  [TILE.DANGER]:     ["#6b1a1a", "#8b2a2a"],  // dark red danger zone
  [TILE.SAND]:       ["#c8a870", "#d4b880"],  // sandy wastes

  // ── Dungeon tiles ─────────────────────────────────────────────────────────
  [TILE.WALL]:       ["#1f1f2a", "#2a2a3a"],  // dark dungeon wall
  [TILE.FLOOR]:      ["#3a3028", "#4a4038"],  // stone floor
  [TILE.DOOR]:       ["#8b5e1a", "#a06a20"],  // wooden door
  [TILE.CHEST]:      ["#c9a227", "#e0b830"],  // gold chest
  [TILE.STAIRS_UP]:  ["#6080a0", "#7090b0"],  // stairs up
  [TILE.STAIRS_DOWN]:["#405060", "#506070"],  // stairs down
  [TILE.PORTAL]:     ["#8040cc", "#9050dd"],  // campaign portal
};

export const PASSABLE = new Set([
  TILE.GRASS,
  TILE.FOREST,
  TILE.SAND,
  TILE.SHALLOW,
  TILE.TOWN,
  TILE.DANGER,
  TILE.FLOOR,
  TILE.DOOR,
  TILE.STAIRS_UP,
  TILE.STAIRS_DOWN,
  TILE.PORTAL,
]);
