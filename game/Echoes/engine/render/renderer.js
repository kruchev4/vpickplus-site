// game/engine/render/renderer.js

import { TILE_COLORS, TILE } from "../world/constants.js";

const TILE_SIZE = 32;

export function renderMap(ctx, map, camera, entities = []) {
  if (!map || !map.tiles) return;

  const startX = Math.floor(camera.x / TILE_SIZE);
  const startY = Math.floor(camera.y / TILE_SIZE);

  const endX = Math.ceil((camera.x + camera.w) / TILE_SIZE);
  const endY = Math.ceil((camera.y + camera.h) / TILE_SIZE);

  for (let ty = startY; ty < endY; ty++) {
    for (let tx = startX; tx < endX; tx++) {
      if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) continue;

      const sx = tx * TILE_SIZE - camera.x;
      const sy = ty * TILE_SIZE - camera.y;

      drawTile(ctx, map, tx, ty, sx, sy);
    }
  }

  // Draw entities (player, etc)
  for (const e of entities) {
    ctx.fillStyle = e.color || "yellow";
    ctx.fillRect(
      e.x * TILE_SIZE - camera.x,
      e.y * TILE_SIZE - camera.y,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}

function drawTile(ctx, map, tx, ty, sx, sy) {
  const idx = ty * map.width + tx;
  const t = map.tiles[idx];

  const colors = TILE_COLORS[t];
  if (!colors) return;

  ctx.fillStyle = colors[0];
  ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
}

