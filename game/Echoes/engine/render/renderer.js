import { TILE_COLORS } from "../world/constants.js";
import { GameState } from "../state/GameState.js";

const TILE_SIZE = GameState.TILE_SIZE;

export function renderMap(ctx, map, camera, entities = []) {
  let drawn = 0;

  
  if (!map || !map.tiles) return;

  const startX = Math.floor(camera.x / TILE_SIZE);
  const startY = Math.floor(camera.y / TILE_SIZE);
  const endX = Math.ceil((camera.x + camera.w) / TILE_SIZE);
  const endY = Math.ceil((camera.y + camera.h) / TILE_SIZE);

  for (let ty = startY; ty < endY; ty++) {
    for (let tx = startX; tx < endX; tx++) {
      if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) continue;
      drawn++;

      const idx = ty * map.width + tx;
      const tile = map.tiles[idx];
      const colors = TILE_COLORS[tile];
      if (!colors) continue;

      ctx.fillStyle = colors[0];
      ctx.fillRect(
        tx * TILE_SIZE - camera.x,
        ty * TILE_SIZE - camera.y,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }
  if (drawn > 0) {
  
}

  // Draw entities (player for now)
  for (const e of entities) {
    ctx.fillStyle = e.color || "#ff69b4";
    ctx.fillRect(
      e.x * TILE_SIZE - camera.x,
      e.y * TILE_SIZE - camera.y,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}
