// game/engine/world/GameMap.js
export class GameMap {
  constructor(json) {
    this.id     = json.id;
    this.name   = json.name || json.id;
    this.type   = json.type || "world";   // "world" | "dungeon" | "town" | "instance"
    this.width  = json.width;
    this.height = json.height;

    // ── Tile data ──────────────────────────────────────────────────────────
    const size    = (json.width || 0) * (json.height || 0);
    this.tiles    = Uint8Array.from(json.tiles    || new Array(size).fill(0));
    this.variants = Uint8Array.from(json.variants || new Array(size).fill(0));

    // ── World features — all driven from JSON ──────────────────────────────
    this.towns           = json.towns           || [];
    this.portals         = json.portals         || [];
    this.bosses          = json.bosses          || [];
    this.specialFeatures = json.specialFeatures || [];
    this.npcs            = json.npcs            || [];
    this.entities        = json.entities        || [];
    this.encounters      = json.encounters      || [];

    // ── Capitol city (shortcut ref, also in towns array) ───────────────────
    this.capitol = json.capitol || null;

    // ── Blimp transportation network ───────────────────────────────────────
    this.blimpRoutes = json.blimpRoutes || [];

    // ── World metadata — drives scaling, mood, encounters ─────────────────
    // Support both legacy `metadata` key and new `meta` key
    const meta = json.meta || json.metadata || {};
    this.meta = {
      biome:                  meta.biome                  || "grass",
      tier:                   meta.tier                   ?? 0,
      spawnOffset:            meta.spawnOffset            || { x: 0, y: 0 },
      distanceFromSpawn:      meta.distanceFromSpawn      ?? this._calcDistance(meta.spawnOffset),
      encounterRate:          meta.encounterRate          ?? 0.08,
      monsterScaleMultiplier: meta.monsterScaleMultiplier ?? 1.0,
      lootTier:               meta.lootTier               ?? meta.tier ?? 0,
      description:            meta.description            || "",
      ...meta  // preserve any future fields
    };

    // Keep legacy `metadata` accessible too
    this.metadata = this.meta;

    // ── Flags ──────────────────────────────────────────────────────────────
    this.isTown = json.isTown || json.type === "town" || false;
  }

  // ── Tile access ────────────────────────────────────────────────────────────
  getTile(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.tiles[y * this.width + x];
  }

  setTile(x, y, type) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.tiles[y * this.width + x] = type;
  }

  getVariant(x, y) {
    return this.variants[y * this.width + x];
  }

  fill(type) {
    this.tiles.fill(type);
  }

  isPassable(x, y, PASSABLE) {
    const t = this.getTile(x, y);
    return PASSABLE.has(t);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  // Calculate distance from spawn based on spawnOffset
  _calcDistance(spawnOffset) {
    if (!spawnOffset) return 0;
    return Math.max(Math.abs(spawnOffset.x || 0), Math.abs(spawnOffset.y || 0));
  }

  // Get the effective monster scale for this world
  // Used by makeEnemy() to scale hp/atk/def
  getMonsterScale(zoneLevel = 0) {
    const base = this.meta.monsterScaleMultiplier || 1.0;
    const dist = this.meta.distanceFromSpawn || 0;
    return base + (dist * 0.2) + (zoneLevel * 0.05);
  }

  // Get loot tier for this world
  getLootTier() {
    return this.meta.lootTier ?? this.meta.tier ?? 0;
  }

  // Get encounter rate for a given tile type
  getEncounterRate(tileType) {
    // Custom rates from JSON take priority
    if (this.encounters?.length) {
      const rule = this.encounters.find(e => e.tile === tileType);
      if (rule) return rule.rate;
    }
    // Scale base rate by world meta
    const base = this.meta.encounterRate || 0.08;
    const tileRates = { 6: 3.0, 1: 1.5, 2: 1.2, 0: 0.5, 7: 0.8, 4: 0.3 };
    return base * (tileRates[tileType] || 1.0);
  }

  // Find nearest town to a coordinate
  getNearestTown(x, y) {
    if (!this.towns.length) return null;
    return this.towns
      .map(t => ({ ...t, dist: Math.sqrt((t.x-x)**2 + (t.y-y)**2) }))
      .sort((a, b) => a.dist - b.dist)[0];
  }

  // Find town at or near a coordinate
  getTownAt(x, y, radius = 1) {
    return this.towns.find(t =>
      Math.abs(t.x - x) <= radius && Math.abs(t.y - y) <= radius
    ) || null;
  }

  // Find portal at a coordinate
  getPortalAt(x, y) {
    return this.portals.find(p => p.x === x && p.y === y) || null;
  }

  // Get all blimp-capable towns
  getBlimpDocks() {
    return this.towns.filter(t => t.blimpDock);
  }

  // Summary for debugging
  summary() {
    return {
      id:       this.id,
      name:     this.name,
      size:     `${this.width}×${this.height}`,
      tier:     this.meta.tier,
      biome:    this.meta.biome,
      towns:    this.towns.length,
      portals:  this.portals.length,
      bosses:   this.bosses.length,
      features: this.specialFeatures.length,
      capitol:  this.capitol?.name || 'none',
    };
  }
}
