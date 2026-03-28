

import { GameState } from "../state/GameState.js";

export function updateCamera() {
  const cam = GameState.camera;
  const p = GameState.player;
  const map = GameState.activeMap;
  const TILE = GameState.TILE_SIZE;

  // Safety guard
  if (!map || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return;

  // Center camera on player
  cam.x = Math.floor(p.x * TILE - cam.w / 2);
  cam.y = Math.floor(p.y * TILE - cam.h / 2);

  // Clamp camera to world bounds
  const maxX = map.width * TILE - cam.w;
  const maxY = map.height * TILE - cam.h;

  cam.x = Math.max(0, Math.min(cam.x, maxX));
  cam.y = Math.max(0, Math.min(cam.y, maxY));
}
