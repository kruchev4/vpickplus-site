// game/engine/world/constants.js

export const TILE = {
  WALL: 0,
  FLOOR: 1,
};

export const TILE_COLORS = {
  0: ["#1f1f1f"],  // WALL - dark gray
  1: ["#3aa655"],  // FLOOR - green
};

export const PASSABLE = new Set([
  TILE.FLOOR
]);
