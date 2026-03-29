import { TILE_COLORS } from "../world/constants.js";
import { GameState } from "../state/GameState.js";

const TILE_SIZE = GameState.TILE;

// ── Class colors ──────────────────────────────────────────────────────────────
const CLASS_COLORS = {
  fighter:   { body: '#c0392b', trim: '#e74c3c', skin: '#f5cba7' },
  barbarian: { body: '#922b21', trim: '#e74c3c', skin: '#f0b27a' },
  paladin:   { body: '#2471a3', trim: '#f0e68c', skin: '#f5cba7' },
  rogue:     { body: '#1a1a2e', trim: '#8e44ad', skin: '#f5cba7' },
  ranger:    { body: '#1e8449', trim: '#7dcea0', skin: '#f0b27a' },
  monk:      { body: '#d4ac0d', trim: '#f9e79f', skin: '#f0b27a' },
  wizard:    { body: '#6c3483', trim: '#a569bd', skin: '#f5cba7' },
  sorcerer:  { body: '#1a5276', trim: '#5dade2', skin: '#f5cba7' },
  warlock:   { body: '#212f3c', trim: '#7fb3d3', skin: '#aab7b8' },
  cleric:    { body: '#f0f3f4', trim: '#f39c12', skin: '#f5cba7' },
  druid:     { body: '#1d6a35', trim: '#a9cce3', skin: '#f0b27a' },
  bard:      { body: '#9b59b6', trim: '#f1c40f', skin: '#f5cba7' },
};

// ── Shared drawing helpers ────────────────────────────────────────────────────
function head(ctx, sx, sy, s, skin) {
  ctx.fillStyle = skin;
  ctx.fillRect(sx + 11*s, sy + 4*s, 10*s, 9*s);
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(sx + 13*s, sy + 7*s, 2*s, 2*s);
  ctx.fillRect(sx + 17*s, sy + 7*s, 2*s, 2*s);
}
function body(ctx, sx, sy, s, color) {
  ctx.fillStyle = color;
  ctx.fillRect(sx + 10*s, sy + 13*s, 12*s, 10*s);
}
function legs(ctx, sx, sy, s, c1, c2) {
  ctx.fillStyle = c1;
  ctx.fillRect(sx + 10*s, sy + 23*s, 5*s, 7*s);
  ctx.fillStyle = c2 || c1;
  ctx.fillRect(sx + 17*s, sy + 23*s, 5*s, 7*s);
}
function arms(ctx, sx, sy, s, color) {
  ctx.fillStyle = color;
  ctx.fillRect(sx + 5*s,  sy + 13*s, 5*s, 8*s);
  ctx.fillRect(sx + 22*s, sy + 13*s, 5*s, 8*s);
}

// ── Class sprites ─────────────────────────────────────────────────────────────
function drawFighter(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#555', '#333');
  body(ctx, sx, sy, s, c.body);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 8*s,  sy + 13*s, 4*s, 4*s);
  ctx.fillRect(sx + 20*s, sy + 13*s, 4*s, 4*s);
  arms(ctx, sx, sy, s, '#777');
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = '#888';
  ctx.fillRect(sx + 10*s, sy + 2*s, 12*s, 5*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 14*s, sy + 1*s, 4*s, 3*s);
  ctx.fillStyle = '#aaa';
  ctx.fillRect(sx + 27*s, sy + 11*s, 2*s, 12*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 25*s, sy + 14*s, 6*s, 2*s);
}

function drawWizard(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, c.body);
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 8*s, sy + 13*s, 16*s, 14*s);
  arms(ctx, sx, sy, s, c.body);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = c.body;
  ctx.beginPath();
  ctx.moveTo(sx + 16*s, sy);
  ctx.lineTo(sx + 9*s,  sy + 7*s);
  ctx.lineTo(sx + 23*s, sy + 7*s);
  ctx.fill();
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 9*s, sy + 6*s, 14*s, 3*s);
  ctx.fillStyle = '#8b6914';
  ctx.fillRect(sx + 3*s, sy + 8*s, 3*s, 22*s);
  ctx.fillStyle = c.trim;
  ctx.beginPath();
  ctx.arc(sx + 4.5*s, sy + 7*s, 4*s, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(sx + 3.5*s, sy + 6*s, 1.5*s, 0, Math.PI*2);
  ctx.fill();
}

function drawWarlock(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#1a1a2e');
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 8*s, sy + 13*s, 16*s, 14*s);
  arms(ctx, sx, sy, s, c.body);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 9*s,  sy + 2*s, 14*s, 11*s);
  ctx.fillRect(sx + 7*s,  sy + 7*s, 4*s,  7*s);
  ctx.fillRect(sx + 21*s, sy + 7*s, 4*s,  7*s);
  ctx.fillStyle = c.trim;
  ctx.beginPath();
  ctx.arc(sx + 5*s, sy + 21*s, 4*s, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(sx + 4*s, sy + 20*s, 1.5*s, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#6b2d0f';
  ctx.fillRect(sx + 23*s, sy + 14*s, 6*s, 8*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 24*s, sy + 16*s, 4*s, 1*s);
  ctx.fillRect(sx + 24*s, sy + 18*s, 4*s, 1*s);
}

function drawCleric(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#aaa', '#888');
  body(ctx, sx, sy, s, c.body);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 14*s, sy + 15*s, 4*s, 7*s);
  ctx.fillRect(sx + 12*s, sy + 17*s, 8*s, 3*s);
  arms(ctx, sx, sy, s, c.body);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 11*s, sy + 2*s, 10*s, 7*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 14*s, sy + 1*s, 4*s, 8*s);
  ctx.fillStyle = '#888';
  ctx.fillRect(sx + 24*s, sy + 10*s, 3*s, 14*s);
  ctx.fillStyle = '#aaa';
  ctx.fillRect(sx + 22*s, sy + 9*s,  7*s, 5*s);
}

function drawPaladin(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#5d6d7e', '#4a5568');
  body(ctx, sx, sy, s, '#7f8c8d');
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 12*s, sy + 13*s, 8*s, 10*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 14*s, sy + 15*s, 4*s, 6*s);
  ctx.fillRect(sx + 12*s, sy + 17*s, 8*s, 2*s);
  arms(ctx, sx, sy, s, '#7f8c8d');
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = '#95a5a6';
  ctx.fillRect(sx + 10*s, sy + 2*s, 12*s, 11*s);
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(sx + 12*s, sy + 6*s, 8*s, 3*s);
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 1*s, sy + 12*s, 8*s, 11*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 3*s, sy + 14*s, 4*s, 7*s);
  ctx.fillRect(sx + 1*s, sy + 17*s, 8*s, 2*s);
  ctx.fillStyle = '#bdc3c7';
  ctx.fillRect(sx + 27*s, sy + 9*s, 2*s, 14*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 25*s, sy + 13*s, 6*s, 2*s);
}

function drawRogue(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#2c3e50', '#1a252f');
  body(ctx, sx, sy, s, c.body);
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(sx + 7*s,  sy + 12*s, 5*s, 15*s);
  ctx.fillRect(sx + 20*s, sy + 12*s, 5*s, 15*s);
  arms(ctx, sx, sy, s, c.body);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 9*s, sy + 3*s, 14*s, 10*s);
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(sx + 11*s, sy + 8*s, 10*s, 4*s);
  ctx.fillStyle = '#bdc3c7';
  ctx.fillRect(sx + 3*s,  sy + 15*s, 2*s, 9*s);
  ctx.fillRect(sx + 27*s, sy + 15*s, 2*s, 9*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 2*s,  sy + 14*s, 4*s, 2*s);
  ctx.fillRect(sx + 26*s, sy + 14*s, 4*s, 2*s);
}

function drawRanger(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#4a4a2a', '#333321');
  body(ctx, sx, sy, s, c.body);
  ctx.fillStyle = '#8b6914';
  ctx.fillRect(sx + 21*s, sy + 10*s, 4*s, 12*s);
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(sx + 22*s, sy + 9*s, 2*s, 3*s);
  ctx.fillRect(sx + 22*s, sy + 13*s, 2*s, 3*s);
  arms(ctx, sx, sy, s, c.body);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 9*s, sy + 3*s, 14*s, 10*s);
  ctx.fillRect(sx + 7*s, sy + 7*s, 18*s, 3*s);
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 2*s;
  ctx.beginPath();
  ctx.arc(sx + 3*s, sy + 16*s, 10*s, -Math.PI*0.5, Math.PI*0.5);
  ctx.stroke();
  ctx.strokeStyle = '#f5cba7';
  ctx.lineWidth = s * 0.5;
  ctx.beginPath();
  ctx.moveTo(sx + 3*s, sy + 6*s);
  ctx.lineTo(sx + 3*s, sy + 26*s);
  ctx.stroke();
}

function drawBarbarian(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#5d4037', '#4e342e');
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 8*s, sy + 13*s, 16*s, 10*s);
  ctx.fillStyle = '#795548';
  ctx.fillRect(sx + 8*s, sy + 13*s, 16*s, 3*s);
  ctx.fillStyle = c.skin;
  ctx.fillRect(sx + 3*s,  sy + 13*s, 7*s, 9*s);
  ctx.fillRect(sx + 22*s, sy + 13*s, 7*s, 9*s);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = '#4a2f1a';
  ctx.fillRect(sx + 9*s,  sy + 2*s,  14*s, 6*s);
  ctx.fillRect(sx + 7*s,  sy + 4*s,  4*s,  8*s);
  ctx.fillRect(sx + 21*s, sy + 4*s,  4*s,  8*s);
  ctx.fillStyle = '#888';
  ctx.fillRect(sx + 25*s, sy + 8*s, 3*s, 16*s);
  ctx.fillStyle = '#aaa';
  ctx.fillRect(sx + 24*s, sy + 8*s, 7*s, 5*s);
  ctx.fillRect(sx + 26*s, sy + 13*s, 5*s, 4*s);
}

function drawMonk(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, c.body, '#b7950b');
  body(ctx, sx, sy, s, c.body);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 10*s, sy + 18*s, 12*s, 3*s);
  ctx.fillStyle = c.skin;
  ctx.fillRect(sx + 5*s,  sy + 13*s, 5*s, 7*s);
  ctx.fillRect(sx + 22*s, sy + 13*s, 5*s, 7*s);
  ctx.fillRect(sx + 4*s,  sy + 19*s, 6*s, 5*s);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(sx + 14*s, sy + 2*s, 4*s, 5*s);
  ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
  ctx.beginPath();
  ctx.arc(sx + 7*s, sy + 22*s, 5*s, 0, Math.PI*2);
  ctx.fill();
}

function drawDruid(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#4a2f1a');
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 8*s, sy + 13*s, 16*s, 14*s);
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(sx + 9*s,  sy + 14*s, 4*s, 4*s);
  ctx.fillRect(sx + 19*s, sy + 14*s, 4*s, 4*s);
  ctx.fillRect(sx + 13*s, sy + 20*s, 6*s, 4*s);
  arms(ctx, sx, sy, s, c.body);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = '#8b6914';
  ctx.fillRect(sx + 11*s, sy + 3*s, 10*s, 3*s);
  ctx.fillRect(sx + 11*s, sy + 1*s, 2*s,  4*s);
  ctx.fillRect(sx + 19*s, sy + 1*s, 2*s,  4*s);
  ctx.fillRect(sx + 13*s, sy + 0,   2*s,  3*s);
  ctx.fillRect(sx + 17*s, sy + 0,   2*s,  3*s);
  ctx.fillStyle = '#6b8e23';
  ctx.fillRect(sx + 3*s, sy + 10*s, 3*s, 20*s);
  ctx.fillStyle = '#2ecc71';
  ctx.beginPath();
  ctx.arc(sx + 4.5*s, sy + 9*s, 4*s, 0, Math.PI*2);
  ctx.fill();
}

function drawBard(ctx, sx, sy, s, c) {
  legs(ctx, sx, sy, s, '#6c3483', '#5b2c6f');
  body(ctx, sx, sy, s, c.body);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 10*s, sy + 13*s, 12*s, 2*s);
  ctx.fillRect(sx + 10*s, sy + 21*s, 12*s, 2*s);
  arms(ctx, sx, sy, s, c.body);
  head(ctx, sx, sy, s, c.skin);
  ctx.fillStyle = c.body;
  ctx.fillRect(sx + 8*s,  sy + 5*s, 16*s, 4*s);
  ctx.fillRect(sx + 11*s, sy + 2*s, 10*s, 5*s);
  ctx.fillStyle = c.trim;
  ctx.fillRect(sx + 20*s, sy + 1*s, 3*s, 6*s);
  ctx.fillRect(sx + 22*s, sy + 0,   2*s, 4*s);
  ctx.fillStyle = '#a0522d';
  ctx.beginPath();
  ctx.ellipse(sx + 26*s, sy + 20*s, 4*s, 5*s, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(sx + 25*s, sy + 14*s, 2*s, 7*s);
  ctx.fillRect(sx + 24*s, sy + 15*s, 4*s, 1*s);
  ctx.fillRect(sx + 24*s, sy + 17*s, 4*s, 1*s);
}

function drawSprite(ctx, sx, sy, ts, cls) {
  const c = CLASS_COLORS[cls] || CLASS_COLORS.fighter;
  const s = ts / 32;

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(sx + ts/2, sy + ts - 2*s, ts*0.32, ts*0.1, 0, 0, Math.PI*2);
  ctx.fill();

  switch (cls) {
    case 'wizard':    drawWizard(ctx, sx, sy, s, c);    break;
    case 'sorcerer':  drawWizard(ctx, sx, sy, s, c);    break;
    case 'warlock':   drawWarlock(ctx, sx, sy, s, c);   break;
    case 'cleric':    drawCleric(ctx, sx, sy, s, c);    break;
    case 'paladin':   drawPaladin(ctx, sx, sy, s, c);   break;
    case 'rogue':     drawRogue(ctx, sx, sy, s, c);     break;
    case 'ranger':    drawRanger(ctx, sx, sy, s, c);    break;
    case 'barbarian': drawBarbarian(ctx, sx, sy, s, c); break;
    case 'monk':      drawMonk(ctx, sx, sy, s, c);      break;
    case 'druid':     drawDruid(ctx, sx, sy, s, c);     break;
    case 'bard':      drawBard(ctx, sx, sy, s, c);      break;
    default:          drawFighter(ctx, sx, sy, s, c);   break;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function renderMap(ctx, map, camera, entities = []) {
  if (!map || !map.tiles) return;

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

  for (const e of entities) {
    const sx  = Math.round(e.x * TILE_SIZE - camera.x);
    const sy  = Math.round(e.y * TILE_SIZE - camera.y);
    const cls = (e.cls?.id || e.cls || 'fighter').toLowerCase();
    ctx.save();
    drawSprite(ctx, sx, sy, TILE_SIZE, cls);
    ctx.restore();
  }
}
