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
export function generateOverworldTiles({ worldId, seed }) {
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
// ─────────────────────────────────────────────────────────────
// Phase 1: Generate a full world object (tiles + variants + metadata)
// Paste BELOW generateOverworldTiles(...)
// ─────────────────────────────────────────────────────────────

export function generateOverworldWorld({ worldId, seed }) {
  // 1) Base tiles from your existing generator
  const tiles = generateOverworldTiles({ worldId, seed });

  // 2) variants is REQUIRED by GameMap
  const size = WORLD_WIDTH * WORLD_HEIGHT;
  const variants = new Array(size).fill(0);

  // 3) Phase 1 world dressing (geography + towns + roads + dungeon marker)
  const meta = decorateWorldPhase1({ worldId, seed, tiles, variants, W: WORLD_WIDTH, H: WORLD_HEIGHT });

  // 4) Return a GameMap-compatible world JSON
  return {
    id: worldId,
    name: worldId.replace("overworld_", "").toUpperCase(),
    type: "world",
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    tiles,
    variants,

    // Phase 1: data is stored but engine can ignore it for now
    towns: meta.towns,
    portals: meta.portals,
    npcs: [],
    entities: [],
    encounters: [],
    metadata: meta.metadata
  };
}

// Dev helper so you can generate from console
window.__generateOverworldWorld = generateOverworldWorld;

// ─────────────────────────────────────────────────────────────
// Phase 1 decorator: mountains, lakes, rivers, towns, roads, dungeon marker
// ─────────────────────────────────────────────────────────────
function decorateWorldPhase1({ worldId, seed, tiles, variants, W, H }) {
  // Tile IDs must match your renderer
  const T = {
    GRASS:0, FOREST:1, MOUNTAIN:2, DEEP:3, SHALLOW:4, TOWN:5, DANGER:6, SAND:7,
    JUNGLE:15, VOLCANO:16, ELDRITCH:17, OBSIDIAN:18, BLIGHT:19
  };

  // 3×3 grid offsets so rivers/terrain can be edge-consistent
  const OFF = {
    overworld_C:[0,0], overworld_N:[0,-1], overworld_S:[0,1], overworld_E:[1,0], overworld_W:[-1,0],
    overworld_NE:[1,-1], overworld_NW:[-1,-1], overworld_SE:[1,1], overworld_SW:[-1,1]
  };
  const [wx, wy] = OFF[worldId] || [0,0];
  const ox = wx * W, oy = wy * H;

  const idx = (x,y) => y*W + x;
  const inb = (x,y) => x>=0 && y>=0 && x<W && y<H;

  // Deterministic hash/noise (fast + stable)
  const hash01 = (x,y,s) => {
    const v = Math.sin((x*127.1 + y*311.7 + s*17.17)) * 43758.5453;
    return v - Math.floor(v);
  };
  const smoothstep = t => t*t*(3-2*t);
  const lerp = (a,b,t) => a + (b-a)*t;

  const noise2 = (x,y,s,scale=32) => {
    const fx = (x+ox)/scale, fy = (y+oy)/scale;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = smoothstep(fx-x0), ty = smoothstep(fy-y0);

    const a = hash01(x0,   y0,   s);
    const b = hash01(x0+1, y0,   s);
    const c = hash01(x0,   y0+1, s);
    const d = hash01(x0+1, y0+1, s);

    return lerp(lerp(a,b,tx), lerp(c,d,tx), ty);
  };

  // Biome-matched road tiles (Phase 1 = tile-based roads)
  function roadTileForWorld(worldId, sampleTile) {
    // Volcano/obsidian worlds: brick/obsidian road
    if (worldId === "overworld_E" || sampleTile === T.OBSIDIAN || sampleTile === T.VOLCANO) return T.OBSIDIAN;

    // Blight worlds: ashen road (blight tile)
    if (worldId === "overworld_S" || sampleTile === T.BLIGHT) return T.BLIGHT;

    // Eldritch worlds: dark road
    if (sampleTile === T.ELDRITCH) return T.OBSIDIAN;

    // Jungle: packed dirt road (use sand for now)
    if (sampleTile === T.JUNGLE) return T.SAND;

    // Default: sand/dirt road
    return T.SAND;
  }

  // ── PASS 1: mountain ridges (impassable belts) ─────────────
  for (let y=0;y<H;y++){
    for (let x=0;x<W;x++){
      const i = idx(x,y);
      const n1 = noise2(x,y, seed+101, 56);
      const n2 = noise2(x,y, seed+202, 18);
      const ridge = Math.abs(n1 - 0.5) * 2; // 0..1
      const height = 0.65*ridge + 0.35*n2;

      const base = tiles[i];
      const bias =
        (base===T.MOUNTAIN || base===T.ELDRITCH) ? -0.07 :
        (base===T.GRASS || base===T.FOREST) ? +0.08 : 0;

      if (height > (0.80 + bias)) {
        tiles[i] = T.MOUNTAIN;
        variants[i] |= 1; // ridge bit
      }
    }
  }

  // ── PASS 2: lakes (deep + shore) ───────────────────────────
  const lakeCount = (worldId === "overworld_C") ? 1 : 2;
  for (let k=0;k<lakeCount;k++){
    const cx = Math.floor(W*0.2 + noise2(30+k, 40+k, seed+303, 8) * W*0.6);
    const cy = Math.floor(H*0.2 + noise2(90+k, 10+k, seed+404, 8) * H*0.6);
    const radius = 10 + Math.floor(noise2(cx, cy, seed+505+k, 12) * 18);

    for (let yy=Math.max(1,cy-radius-2); yy<Math.min(H-1,cy+radius+2); yy++){
      for (let xx=Math.max(1,cx-radius-2); xx<Math.min(W-1,cx+radius+2); xx++){
        const i = idx(xx,yy);
        const dx = xx-cx, dy = yy-cy;
        const d = Math.sqrt(dx*dx+dy*dy);
        const wobble = noise2(xx,yy, seed+606+k, 10) * 3.5;

        if (d < radius - wobble) {
          tiles[i] = T.DEEP;
          variants[i] |= 8; // lake bit
        } else if (d < radius + 2 - wobble && tiles[i] !== T.DEEP) {
          tiles[i] = T.SHALLOW;
          variants[i] |= 16; // shore bit
        }
      }
    }
  }

  // ── PASS 3: rivers (shallow channels) ──────────────────────
  const riverCount = (worldId === "overworld_C") ? 1 : 2;
  for (let r=0;r<riverCount;r++){
    let x = Math.floor(noise2(200+r, 50+r, seed+707, 6) * W);
    let y = Math.floor(noise2(300+r, 80+r, seed+808, 6) * H);

    for (let steps=0; steps<260; steps++){
      const i = idx(x,y);
      if (tiles[i] !== T.DEEP) {
        tiles[i] = T.SHALLOW;
        variants[i] |= 4; // river bit
      }
      if (x<=0 || y<=0 || x>=W-1 || y>=H-1) break;

      const curH = noise2(x,y, seed+909, 28);
      let best = null, bestVal = 999;

      for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = x+dx, ny = y+dy;
        if (!inb(nx,ny)) continue;
        const nh = noise2(nx,ny, seed+909, 28);
        const meander = noise2(nx,ny, seed+1001, 10) * 0.15;
        const score = (nh - curH) + meander;
        if (score < bestVal) { bestVal = score; best = [nx,ny]; }
      }
      if (!best) break;
      x = best[0]; y = best[1];
    }
  }

  // ── PASS 4: towns ──────────────────────────────────────────
  const towns = [];
  const townTarget = 1; // Phase 1: 1 per world
  let placed = 0;

  for (let tries=0; tries<900 && placed<townTarget; tries++){
    const x = Math.floor(noise2(111+tries, 222+tries, seed+1102, 6) * W);
    const y = Math.floor(noise2(333+tries, 444+tries, seed+1203, 6) * H);
    const i = idx(x,y);

    if (x<6 || y<6 || x>W-7 || y>H-7) continue;
    const t = tiles[i];
    if (t===T.DEEP || t===T.SHALLOW || t===T.MOUNTAIN) continue;

    tiles[i] = T.TOWN;
    variants[i] |= 2;
    towns.push({ x, y });
    placed++;
  }

  // ── PASS 5: dungeon entrance marker (Phase 1) ───────────────
  // For Phase 1, mark as DANGER tile and store metadata.
  const portals = [];
  for (let tries=0; tries<1200 && portals.length<1; tries++){
    const x = Math.floor(noise2(555+tries, 666+tries, seed+1404, 6) * W);
    const y = Math.floor(noise2(777+tries, 888+tries, seed+1505, 6) * H);
    const i = idx(x,y);
    if (x<8 || y<8 || x>W-9 || y>H-9) continue;
    const t = tiles[i];
    if (t===T.DEEP || t===T.SHALLOW || t===T.MOUNTAIN || t===T.TOWN) continue;

    tiles[i] = T.DANGER;
    variants[i] |= 64; // portal marker bit
    portals.push({ x, y, kind: "dungeon" });
    break;
  }

  // ── PASS 6: roads (tile roads; biome-matched) ──────────────
  // Connect town -> portal (or town -> map center)
  for (const town of towns) {
    const target = portals[0] || { x: Math.floor(W/2), y: Math.floor(H/2) };
    const roadTile = roadTileForWorld(worldId, tiles[idx(town.x, town.y)]);

    let x = town.x, y = town.y;
    for (let s=0; s<800; s++){
      const i = idx(x,y);
      if (tiles[i] !== T.DEEP && tiles[i] !== T.MOUNTAIN && tiles[i] !== T.TOWN) {
        tiles[i] = roadTile;
        variants[i] |= 128; // road bit
      }
      if (x === target.x && y === target.y) break;
      if (x < target.x) x++; else if (x > target.x) x--;
      if (y < target.y) y++; else if (y > target.y) y--;
    }
  }

  return {
    towns,
    portals,
    metadata: { seed, worldId, phase: 1 }
  };
}

// Phase 1 world dressing: mountains, lakes, rivers, towns, roads, dungeon markers


// dev helper for console generation
// ── DEV / CONSOLE HOOKS ──────────────────────────────────────
// Keep these at TOP LEVEL (not inside any function)

// Full world generator (tiles + variants + metadata)
window.__generateOverworldWorld = generateOverworldWorld;
globalThis.__generateOverworldWorld = generateOverworldWorld;

// Base tiles-only generator (useful for debugging)
window.__generateOverworldTiles = generateOverworldTiles;
globalThis.__generateOverworldTiles = generateOverworldTiles;

console.log("✅ overworldGenerator hooks exposed:", {
  __generateOverworldWorld: typeof window.__generateOverworldWorld,
  __generateOverworldTiles: typeof window.__generateOverworldTiles
});

// ── DEV / CONSOLE HOOK ───────────────────────────────────────
window.__generateOverworldTiles = generateOverworldTiles;
globalThis.__generateOverworldTiles = generateOverworldTiles;

console.log("✅ __generateOverworldTiles exposed to window");
