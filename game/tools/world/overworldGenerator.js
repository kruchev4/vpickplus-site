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
export function generateOverworldWorld({ worldId, seed }) {
  // 1) base tiles (your existing generator)
  const tiles = generateOverworldTiles({ worldId, seed });

  // 2) variants required by GameMap
  const size = WORLD_WIDTH * WORLD_HEIGHT;
  const variants = new Array(size).fill(0);

  // 3) decorate geography + towns + roads + dungeon markers
  const meta = decorateWorldPhase1({ worldId, seed, tiles, variants });

  // 4) return GameMap-compatible world JSON
  return {
    id: worldId,
    name: worldId.replace("overworld_", "").toUpperCase(),
    type: "world",
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    tiles,
    variants,

    // Phase 1: store POIs in metadata (engine can ignore for now)
    towns: meta.towns,
    portals: meta.portals,
    npcs: [],
    entities: [],
    encounters: [],

    metadata: meta.metadata
  };
}
// Phase 1 world dressing: mountains, lakes, rivers, towns, roads, dungeon markers
function decorateWorldPhase1({ worldId, seed, tiles, variants }) {
  const W = WORLD_WIDTH, H = WORLD_HEIGHT;
  const size = W * H;

  // Tile IDs (must match renderer)
  const T = {
    GRASS:0, FOREST:1, MOUNTAIN:2, DEEP:3, SHALLOW:4, TOWN:5, DANGER:6, SAND:7,
    JUNGLE:15, VOLCANO:16, ELDRITCH:17, OBSIDIAN:18, BLIGHT:19
  };

  // World grid offsets (global coords keep rivers consistent across borders)
  const OFF = {
    overworld_C:[0,0], overworld_N:[0,-1], overworld_S:[0,1], overworld_E:[1,0], overworld_W:[-1,0],
    overworld_NE:[1,-1], overworld_NW:[-1,-1], overworld_SE:[1,1], overworld_SW:[-1,1]
  };
  const [wx, wy] = OFF[worldId] || [0,0];
  const ox = wx * W, oy = wy * H;

  const idx = (x,y) => y*W + x;
  const inb = (x,y) => x>=0 && y>=0 && x<W && y<H;

  // deterministic hash
  const hash01 = (x,y, s) => {
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

  // Road tile selection by biome (tile-based roads, Phase 1)
  function roadTileForBase(baseTile) {
    // volcanic/obsidian worlds: "brick" road
    if (baseTile === T.OBSIDIAN || baseTile === T.VOLCANO) return T.OBSIDIAN;
    // blight worlds: ashen path
    if (baseTile === T.BLIGHT) return T.BLIGHT;
    // eldritch worlds: dark path
    if (baseTile === T.ELDRITCH) return T.OBSIDIAN;
    // default: dirt/sand road
    return T.SAND;
  }

  // Identify base biome tile at a point (before we overwrite with features)
  const baseAt = (x,y) => tiles[idx(x,y)];

  // ── PASS 1: Mountain ridges (impassable belts) ─────────────────────────
  for (let y=0;y<H;y++){
    for (let x=0;x<W;x++){
      const i = idx(x,y);
      const n1 = noise2(x,y, seed+101, 56);
      const n2 = noise2(x,y, seed+202, 18);
      const ridge = Math.abs(n1 - 0.5) * 2;
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

  // ── PASS 2: Lakes (deep + shore) ──────────────────────────────────────
  const lakeCount = (worldId === "overworld_C") ? 1 : 2;
  for (let k=0;k<lakeCount;k++){
    const cx = Math.floor(W*0.2 + noise2(30+k, 40+k, seed+303, 8) * W*0.6);
    const cy = Math.floor(H*0.2 + noise2(90+k, 10+k, seed+404, 8) * H*0.6);
    const radius = 10 + Math.floor(noise2(cx, cy, seed+505+k, 12) * 18);

    for (let y=Math.max(1,cy-radius-2); y<Math.min(H-1,cy+radius+2); y++){
      for (let x=Math.max(1,cx-radius-2); x<Math.min(W-1,cx+radius+2); x++){
        const i = idx(x,y);
        const dx = x-cx, dy = y-cy;
        const d = Math.sqrt(dx*dx+dy*dy);
        const wobble = noise2(x,y, seed+606+k, 10) * 3.5;

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

  // ── PASS 3: Rivers (shallow threads, global-consistent) ───────────────
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

  // ── PASS 4: Town placement ────────────────────────────────────────────
  const towns = [];
  const townTarget = (worldId === "overworld_C") ? 1 : 1;

  let placed = 0;
  for (let tries=0; tries<900 && placed<townTarget; tries++){
    const x = Math.floor(noise2(111+tries, 222+tries, seed+1102, 6) * W);
    const y = Math.floor(noise2(333+tries, 444+tries, seed+1203, 6) * H);
    const i = idx(x,y);

    if (x<6 || y<6 || x>W-7 || y>H-7) continue;
    const t = tiles[i];
    if (t===T.DEEP || t===T.SHALLOW || t===T.MOUNTAIN) continue;

    tiles[i] = T.TOWN;
    variants[i] |= 2; // town bit
    towns.push({ x, y });
    placed++;
  }

  // ── PASS 5: Dungeon entrance markers (Phase 1) ────────────────────────
  // Store in metadata for Phase 2; mark tile with DANGER for now.
  const portals = [];
  for (let tries=0; tries<1200 && portals.length<1; tries++){
    const x = Math.floor(noise2(555+tries, 666+tries, seed+1404, 6) * W);
    const y = Math.floor(noise2(777+tries, 888+tries, seed+1505, 6) * H);
    const i = idx(x,y);
    if (x<8 || y<8 || x>W-9 || y>H-9) continue;
    const t = tiles[i];
    if (t===T.DEEP || t===T.SHALLOW || t===T.MOUNTAIN || t===T.TOWN) continue;

    tiles[i] = T.DANGER;
    variants[i] |= 64; // dungeon marker bit
    portals.push({ x, y, mapId: `dungeon_${worldId}_${seed}` }); // placeholder
    break;
  }

  // ── PASS 6: Roads (tile roads, biome-matched) ─────────────────────────
  // Connect each town to nearest portal (or map center).
  for (const t of towns) {
    const target = portals[0] || { x: Math.floor(W/2), y: Math.floor(H/2) };
    const roadTile = roadTileForBase(baseAt(t.x, t.y));

    let x = t.x, y = t.y;
    for (let s=0; s<800; s++){
      const i = idx(x,y);
      if (tiles[i] !== T.DEEP && tiles[i] !== T.MOUNTAIN && tiles[i] !== T.TOWN) {
        tiles[i] = roadTile;
        variants[i] |= 128; // road bit
      }
      if (x === target.x && y === target.y) break;

      // simple step-towards (Phase 1)
      if (x < target.x) x++; else if (x > target.x) x--;
      if (y < target.y) y++; else if (y > target.y) y--;
    }
  }

  return {
    towns,
    portals,
    metadata: {
      seed,
      worldId,
      phase: 1
    }
  };
}


// dev helper for console generation
window.__generateOverworldWorld = generateOverworldWorld;

// ── DEV / CONSOLE HOOK ───────────────────────────────────────
window.__generateOverworldTiles = generateOverworldTiles;
globalThis.__generateOverworldTiles = generateOverworldTiles;

console.log("✅ __generateOverworldTiles exposed to window");
