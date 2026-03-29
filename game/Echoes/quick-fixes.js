/**
 * REALM OF ECHOES — Quick Fixes
 * 1. fillCharSheet crash: null items in G.inventory
 * 2. Town map not triggering: adds debug + more robust town detection
 *
 * Load LAST, after all other patches.
 */

(function quickFixes() {

  // ══════════════════════════════════════════════════════════════
  // FIX 1: fillCharSheet — filter null items from inventory
  // The crash is: item.icon where item is null
  // G.inventory can have null holes from splice operations
  // ══════════════════════════════════════════════════════════════

  const _origFillCharSheet = window.fillCharSheet;
  window.fillCharSheet = function fillCharSheet() {
    // Clean null holes from inventory before rendering
    const G = window.G;
    if (G?.inventory) {
      G.inventory = G.inventory.filter(Boolean);
    }
    // Also clean equipped slots
    if (G?.equipped) {
      for (const slot of Object.keys(G.equipped)) {
        if (G.equipped[slot] && typeof G.equipped[slot] !== 'object') {
          G.equipped[slot] = null;
        }
      }
    }
    // Call original
    if (_origFillCharSheet) {
      _origFillCharSheet();
    }
  };

  // Also patch addToInventory to never add null
  const _origAddToInventory = window.addToInventory;
  window.addToInventory = function addToInventory(itemDef) {
    if (!itemDef || !itemDef.name) return false;
    return _origAddToInventory?.(itemDef) ?? false;
  };

  console.log('[Fix 1] ✅ fillCharSheet null-inventory crash fixed');


  // ══════════════════════════════════════════════════════════════
  // FIX 2: Town detection — more robust tryMove interceptor
  // Replaces the one in town-map-system.js with better town lookup
  // ══════════════════════════════════════════════════════════════

  // Save whatever tryMove is now (after all other patches)
  const _prevTryMove = window.tryMove;

  window.tryMove = function tryMove(dx, dy) {
    const G  = window.G;
    const GS = window.GameState;
    if (!G) return;

    // ── Inside a town map — handle movement internally ──────────
    if (GS?.mode === 'town') {
      const map = GS.activeMap;
      if (!map) return;

      const nx = G.x + dx, ny = G.y + dy;
      if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height) return;

      const tileType = map.getTile(nx, ny);
      const TOWN_PASSABLE = window.TOWN_PASSABLE || new Set([20,22,23,24,25,26,27,28]);

      if (!TOWN_PASSABLE.has(tileType)) return;

      G.prevX = G.x; G.prevY = G.y;
      G.x = nx; G.y = ny;
      GS.player = G;

      window.handleTownTile?.(tileType, nx, ny);

      if (!G._stepCount) G._stepCount = 0;
      G._stepCount++;
      if (G._stepCount % 4 === 0) window.playSound?.('step');
      window.render?.();
      window.updateHUD?.();
      return;
    }

    // ── World mode: intercept tile 5 (TOWN) ────────────────────
    // We check here because index.html's closure calls enterTown()
    // directly, bypassing window.enterTown overrides.
    if (!G.inCombat && GS?.mode !== 'dungeon') {
      const map = GS?.activeMap;
      if (map) {
        const nx = G.x + dx, ny = G.y + dy;
        const tileType = map.getTile?.(nx, ny);

        if (tileType === 5) {
          // Find the town object — check multiple possible locations
          const townSources = [
            map.towns,
            window.TOWNS,
            GS?.activeMap?.towns,
          ].filter(Boolean);

          let town = null;
          for (const source of townSources) {
            town = source.find(t =>
              Math.abs((t.x || 0) - nx) <= 1 &&
              Math.abs((t.y || 0) - ny) <= 1
            );
            if (town) break;
          }

          // If no named town found, create a generic one from tile position
          if (!town) {
            town = { x: nx, y: ny, name: 'Town', id: `town_${nx}_${ny}`,
                     type: 'Town', services: ['Inn','Shop','Temple','Tavern','Vendor'],
                     desc: 'A settlement.', rumours: [] };
          }

          // Move player to the tile first
          G.prevX = G.x; G.prevY = G.y;
          G.x = nx; G.y = ny;
          GS.player = G;

          console.log('[Town] Entering town:', town.name, 'at', nx, ny);

          if (typeof window.enterTownMap === 'function') {
            window.enterTownMap(town);
          } else {
            // Fallback to old system if new one not loaded
            window.enterTown?.(town);
          }
          return;
        }
      }
    }

    // ── Everything else — pass to previous tryMove ──────────────
    _prevTryMove?.(dx, dy);
  };

  console.log('[Fix 2] ✅ tryMove town interceptor installed (robust version)');


  // ══════════════════════════════════════════════════════════════
  // DEBUG HELPER — open console and run: window.debugTown()
  // ══════════════════════════════════════════════════════════════

  window.debugTown = function() {
    const G  = window.G;
    const GS = window.GameState;
    console.group('Town Debug');
    console.log('G.x/y:', G?.x, G?.y);
    console.log('GS.mode:', GS?.mode);
    console.log('activeMap id:', GS?.activeMap?.id);
    console.log('activeMap towns:', GS?.activeMap?.towns);
    console.log('window.TOWNS:', window.TOWNS?.slice(0,3));
    console.log('enterTownMap:', typeof window.enterTownMap);
    console.log('tryMove is patched:', window.tryMove !== undefined);

    // Check current tile
    const tile = GS?.activeMap?.getTile?.(G?.x, G?.y);
    console.log('current tile at player pos:', tile);

    // Find nearest town
    const towns = GS?.activeMap?.towns || window.TOWNS || [];
    const nearest = towns.map(t => ({
      name: t.name, x: t.x, y: t.y,
      dist: Math.sqrt((t.x-G?.x)**2 + (t.y-G?.y)**2)
    })).sort((a,b) => a.dist - b.dist).slice(0,3);
    console.log('nearest towns:', nearest);
    console.groupEnd();
  };

  console.log('[Quick Fixes] ✅ Run window.debugTown() if town still not working');

})();
