import { TILE_COLORS } from "../world/constants.js";
import { GameState } from "../state/GameState.js";

// GameState.TILE is the tile size (was mistakenly read as TILE_SIZE)
const TILE_SIZE = GameState.TILE;

export function renderMap(ctx, map, camera, entities = []) {
  if (!map || !map.tiles) return;

  // Guard against uninitialized TILE_SIZE (would cause NaN and blank canvas)
  if (!TILE_SIZE || TILE_SIZE <= 0) {
    console.warn('[renderer] TILE_SIZE invalid:', TILE_SIZE);
    return;
  }

  const startX = Math.floor(camera.x / TILE_SIZE);
  const startY = Math.floor(camera.y / TILE_SIZE);
  const endX   = Math.ceil((camera.x + camera.w) / TILE_SIZE);
  const endY   = Math.ceil((camera.y + camera.h) / TILE_SIZE);

  for (let ty = startY; ty < endY; ty++) {
    for (let tx = startX; tx < endX; tx++) {
      if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) continue;

      const idx    = ty * map.width + tx;
      const tile   = map.tiles[idx];
      const colors = TILE_COLORS[tile];
      if (!colors) continue;

      ctx.fillStyle = colors[0];
      ctx.fillRect(
        Math.round(tx * TILE_SIZE - camera.x),
        Math.round(ty * TILE_SIZE - camera.y),
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }

  // Draw entities (player, peers, etc.)
 for (const e of entities) {
  if (e.type === "player" && PlayerSprite.complete) {
    ctx.drawImage(
      PlayerSprite,
      Math.round(e.x * TILE_SIZE - camera.x),
      Math.round(e.y * TILE_SIZE - camera.y),
      TILE_SIZE,
      TILE_SIZE
    );
  } else {
    // fallback
    ctx.fillStyle = e.color || "#ff69b4";
    ctx.fillRect(
      Math.round(e.x * TILE_SIZE - camera.x),
      Math.round(e.y * TILE_SIZE - camera.y),
      TILE_SIZE,
      TILE_SIZE
    );
  }
}
