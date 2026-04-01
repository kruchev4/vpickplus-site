/**
 * REALM OF ECHOES — Consolidated Bug Fixes v3
 * Load LAST — after all other scripts.
 *
 * Fixes applied:
 *  1+2. tryMove — town/dungeon transitions, isTown flag, operator precedence bug
 *  3.   Combat ends after first hit — grantCombatLoot misplaced + makeEnemy NaN hp
 *  4.   Quick slot items not consumed — saveGame() missing
 *  5.   Inventory full false positive — null holes counted
 *  6.   Zone announcements in wrong modes/worlds
 *  7.   Ability picker blocked by levelup overlay on top
 *  8.   Respawn at origin — second respawn() definition overwrites first
 *  9.   World bosses invisible — old variable references
 * 10.   Town shop tier labels
 * 11.   fillCharSheet null inventory crash
 */

(function applyFixes() {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // FIX 1+2: tryMove — complete replacement
  // Root causes:
  //   A) `!window.GameState?.mode === 'town'` always false (precedence)
  //   B) Edge transitions fire inside town block
  //   C) Town block requires isTown flag that's never set
  //   D) window.tryMove = tryMove reassigns itself mid-execution (appears twice in body)
  // Solution: single clean tryMove that handles all modes correctly
  // ══════════════════════════════════════════════════════════════

  window.tryMove = function tryMove(dx, dy) {
    const G  = window.G;
    const GS = window.GameState;
    if (!G || G.inCombat) return;

    const mode    = GS?.mode || 'world';
    const map     = GS?.activeMap;
    const W       = map?.width  || window.MAP_W || 240;
    const H       = map?.height || window.MAP_H || 180;
    const getTile = (x, y) => map?.getTile?.(x, y) ?? 0;
    const nx      = G.x + dx;
    const ny      = G.y + dy;

    // ── TOWN MODE ────────────────────────────────────────────────
    // Gate strictly — NO edge transitions inside a town
    if (mode === 'town') {
      if (!map) return;
      const TOWN_P = new Set([20, 22, 23, 24, 25, 26, 27, 28]);
      if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height) return;
      const tt = getTile(nx, ny);
      if (!TOWN_P.has(tt)) return;
      G.prevX = G.x; G.prevY = G.y;
      G.x = nx; G.y = ny;
      GS.player = G;
      window.handleTownTile?.(tt, nx, ny);
      if (!G._stepCount) G._stepCount = 0; G._stepCount++;
      if (G._stepCount % 4 === 0) playSound('step');
      render(); updateHUD();
      return;
    }

    // ── DUNGEON MODE ─────────────────────────────────────────────
    // Gate strictly — NO edge transitions inside a dungeon
    if (mode === 'dungeon') {
      const DUNG_P = new Set([9, 10, 11, 12, 13]);
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) return;
      const dt = getTile(nx, ny);
      if (!DUNG_P.has(dt)) return;
      G.prevX = G.x; G.prevY = G.y;
      G.x = nx; G.y = ny;
      GS.player = G;
      // Boss proximity
      const boss = (window._dungeonMonsters || []).find(m =>
        m.alive && m.isBoss && Math.abs(nx - m.x) <= 2 && Math.abs(ny - m.y) <= 2);
      if (boss) { boss.alive = false; triggerDungeonBoss(boss); return; }
      // Stairs
      if (dt === 13) {
        if (confirm('Exit the dungeon?')) exitDungeon();
        else { G.x = G.prevX; G.y = G.prevY; }
        return;
      }
      // Encounters
      if ((G.encounterCooldown || 0) <= 0 && Math.random() < (dt === 9 ? 0.15 : 0.08)) {
        if (!checkEncounterAvoid()) { triggerDungeonEncounter(); return; }
      }
      G.encounterCooldown = Math.max(0, (G.encounterCooldown || 0) - 1);
      if (!G._stepCount) G._stepCount = 0; G._stepCount++;
      if (G._stepCount % 3 === 0) playSound('step');
      markVisited(G.x, G.y, 4);
      if (G._stepCount % 3 === 0) updateMinimapMode();
      render(); updateHUD();
      return;
    }

    // ── WORLD MODE ───────────────────────────────────────────────
    // Bounds check — edge transitions are handled by the original
    // tryMove closure in index.html which has access to loadWorld.
    // We must NOT intercept them here or the same map reloads.
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) return;

    const WORLD_P = window.PASSABLE_TILES || new Set([0,1,4,5,6,7,15,16,17,18,19,9,10,11,12,13,20,22,23,24,25,26,27,28]);
    const tileType = getTile(nx, ny);
    if (!WORLD_P.has(tileType)) return;

    // Co-op peer
    if (!coopIsHost && coopActive) {
      G.prevX = G.x; G.prevY = G.y;
      G.x = nx; G.y = ny;
      GS.player = G;
      coopSendMove(dx, dy);
      if (!G._stepCount) G._stepCount = 0; G._stepCount++;
      if (G._stepCount % 3 === 0) playSound('step');
      render(); updateHUD();
      return;
    }

    G.prevX = G.x; G.prevY = G.y;
    G.x = nx; G.y = ny;
    GS.player = G;

    // Town entry — use new system, never set G.inTown=true
    if (tileType === 5) {
      G.inTown = false; // ensure flag never blocks movement
      const towns = map?.towns || window.TOWNS || [];
      let town = towns.find(t => Math.abs(t.x - nx) <= 1 && Math.abs(t.y - ny) <= 1);
      if (!town) town = { x: nx, y: ny, name: 'Town', id: `town_${nx}_${ny}`,
        type: 'Town', services: ['Inn','Shop','Temple','Tavern','Vendor'], desc: '', rumours: [] };
      if (window.enterTownMap) { window.enterTownMap(town); return; }
    }

    // Portal
    if (typeof checkPortal === 'function' && checkPortal(nx, ny)) return;

    // World boss
    if (typeof worldBosses !== 'undefined') {
      const boss = worldBosses.find(b => b.alive && Math.abs(nx - b.x) <= 1 && Math.abs(ny - b.y) <= 1);
      if (boss) { triggerBossCombat(boss); return; }
    }

    // Zone hints — ONLY on central overworld
    const onCentral = !GS?.currentWorldId ||
      GS.currentWorldId === 'overworld_C' ||
      GS.currentWorldId === 'overworld_generated';
    if (onCentral) {
      const _zl = Math.min(15, Math.floor(Math.sqrt((G.x - 120) ** 2 + (G.y - 90) ** 2) / 15));
      if (G._lastZone !== _zl) {
        G._lastZone = _zl;
        if (_zl > 0) {
          const zn = ['','Borderlands','Contested Wilds','Dark Reaches','Shadow Lands',
            'Cursed Wastes','Blighted Fields','The Howling Deep','Riftlands','Void Marches',
            'Desolation','The Screaming Dark','Oblivion Edge','The Shattered Realm',
            "World's End",'Boss Territory'];
          toast(`${zn[_zl]} — Zone ${_zl}`);
        }
      }
    }

    // Encounters
    if ((G.encounterCooldown || 0) <= 0) {
      let chance = 0;
      if (tileType === 6) chance = .30;
      else if (tileType === 1) chance = .12;
      else if (tileType === 2) chance = .10;
      else if (tileType === 0) chance = .04;
      else if (tileType === 7) chance = .06;
      if (chance > 0 && Math.random() < chance && !checkEncounterAvoid()) {
        triggerCombat(tileType); return;
      }
    }
    G.encounterCooldown = Math.max(0, (G.encounterCooldown || 0) - 1);

    // Biome flavour
    const prevType = getTile(G.prevX, G.prevY);
    if (tileType !== prevType) {
      const msgs = { 1:'You enter a dense, shadowed forest.', 2:'The path grows steep and rocky.',
        6:'⚠ A chill runs through you. Something lurks here.', 7:'Hot sand crunches underfoot.',
        0:'You emerge onto open grassland.', 4:'You wade through shallow waters.' };
      if (msgs[tileType]) addLog(msgs[tileType]);
    }

    if (!G._stepCount) G._stepCount = 0; G._stepCount++;
    if (G._stepCount % 3 === 0) playSound('step');
    if (G._stepCount % 20 === 0) saveGame();
    if (coopActive && coopMyId && _fbRoomRef) {
      _fbRoomRef.child('players/' + coopMyId).update({ x: G.x, y: G.y, hp: G.hp, ts: Date.now() });
    }
    markVisited(G.x, G.y, 6);
    if (G._stepCount % 3 === 0) updateMinimapMode();
    render(); updateHUD();
  };

  // Also patch enterTownMap to always set isTown flag after loading
  const _origEnterTownMap = window.enterTownMap;
  window.enterTownMap = async function enterTownMap(town) {
    if (_origEnterTownMap) await _origEnterTownMap(town);
    const GS = window.GameState;
    if (GS?.activeMap && GS.mode === 'town') {
      GS.activeMap.isTown = true;
    }
    // Ensure inTown never blocks movement
    if (window.G) window.G.inTown = false;
  };

  console.log('[Fix 1+2] ✅ tryMove — all mode transitions correct, isTown patched');


  // ══════════════════════════════════════════════════════════════
  // FIX 3: Combat ends after first hit
  // A) makeEnemy uses mon.hd but MONSTER_DEFS only have .hp → NaN hpMax
  // B) grantCombatLoot called at TOP of checkCombatEnd every single time
  // ══════════════════════════════════════════════════════════════

  window.makeEnemy = function makeEnemy(mon, zoneLevel, startDelayMs) {
    const lvlBonus = Math.floor(zoneLevel / 3);
    // Support both MONSTERS format (.hd) and MONSTER_DEFS format (.hp)
    let hpMax;
    if (mon.hd) {
      hpMax = rollDice(mon.hd, 1 + lvlBonus) + zoneLevel * 2;
    } else {
      // MONSTER_DEFS: scale base .hp by zone level
      hpMax = Math.floor((mon.hp || 10) * (1 + lvlBonus * 0.3)) + zoneLevel * 2;
    }
    hpMax = Math.max(1, hpMax || 10); // never NaN or 0

    const dmgBase = mon.hd
      ? Math.floor(mon.hd / 4) + 1
      : Math.floor(((mon.atk || 5) - 2) / 3) + 1;

    return {
      def: mon,
      hp: hpMax, hpMax,
      atk: (mon.atk || 3) + lvlBonus,
      dmg: dmgBase + lvlBonus,
      ac: (mon.def || 0) + 9 + lvlBonus,
      timer: 0, timerMax: randInt(1800, 3000),
      timerStartDelay: startDelayMs,
      timerStarted: false,
      status: {},
      _announcedDead: false,
    };
  };

  // Patch checkCombatEnd — move grantCombatLoot to victory branch only
  const _origCheckCombatEnd = window.checkCombatEnd;
  window.checkCombatEnd = function checkCombatEnd() {
    if (!combat.active) return false;

    // Announce newly dead (no loot yet)
    combat.enemies.forEach((e, i) => {
      if (e.hp <= 0 && !e._announcedDead) {
        e._announcedDead = true;
        addCombatLog(`${e.def.name} is defeated!`, 'player-hit');
        const fig = document.getElementById('bf-fig-enemy' + i);
        if (fig) fig.classList.add('dead');
      }
    });

    const alive = combat.enemies.filter(e => e.hp > 0);

    // Retarget if current target is dead
    if (alive.length > 0 && combat.enemies[combat.targetIdx]?.hp <= 0) {
      const next = combat.enemies.findIndex(e => e.hp > 0);
      if (next >= 0) {
        combat.targetIdx = next;
        addCombatLog(`Targeting ${combat.enemies[next].def.name}!`, 'sys');
        updateBattlefieldBars();
      }
      return false;
    }

    // Victory
    if (alive.length === 0) {
      combat.active = false;
      G.inCombat = false;
      G._acBonus = 0; G.defending = false;
      if (combat.animFrame) { cancelAnimationFrame(combat.animFrame); combat.animFrame = null; }
      _resetPlayerCast();

      let xpGain = 0, goldGain = 0;
      combat.enemies.forEach(e => {
        xpGain  += (e.def.xp || 100) + G.level * 10;
        goldGain += randInt((e.def.gold?.[0]) || 0, (e.def.gold?.[1]) || 5);
      });

      // Campaign boss
      const bossEnemy = combat.enemies.find(e => e.isCampBoss);
      if (bossEnemy?.campRoom && campState) {
        const e = bossEnemy;
        G.xp += xpGain; G.gold += (e.campRoom.bossReward?.gold || goldGain);
        checkOnKillPassives(); playSound('victory');
        addCombatLog(`Victory! +${xpGain} XP  +${e.campRoom.bossReward?.gold || goldGain} gp`, 'player-hit');
        if (e.campRoom.bossReward?.loot) {
          e.campRoom.bossReward.loot.forEach(item => {
            if (item.tier === 'legendary') { addLog(`⭐ LEGENDARY: ${item.name}`, 'legendary'); toast(`⭐ Legendary: ${item.name}!`); }
            addToInventory({ ...item, qty: 1 });
          });
        }
        addLog(`Victory! Defeated ${e.def.name}.`, 'sys');
        setTimeout(() => {
          document.getElementById('ov-combat').classList.remove('active');
          G.inCombat = false; combat.active = false;
          const nextRoom = campState.camp.rooms.find(r => r.id === e.campRoom.next);
          campState.prog.completedRooms.push(e.campRoom.id);
          saveGame();
          if (nextRoom) showRoom(nextRoom); else endCampaign();
        }, 1400);
        return true;
      }

      G.xp += xpGain; G.gold += goldGain;
      checkOnKillPassives();
      playSound('victory');
      const names = combat.enemies.map(e => e.def.name).join(', ');
      addCombatLog(`Victory! +${xpGain} XP  +${goldGain} gp`, 'player-hit');
      addLog(`Victory! Defeated ${names}.`, 'sys');
      addLog(`+${xpGain} XP · ${G.xp}/${G.xpNext} to next level`, 'loot');
      playSound('gold');

      // ── Grant loot ONLY here on victory ──
      if (typeof window.grantCombatLoot === 'function') {
        window.grantCombatLoot(combat.enemies);
      } else {
        combat.enemies.forEach(e => {
          if (Math.random() < .4 && e.def.loot?.length) {
            const lootName = e.def.loot[randInt(0, e.def.loot.length - 1)];
            addLog(`Found: ${lootName}!`, 'loot');
            addToInventory({ name: lootName, icon: '📦', desc: 'Item', price: randInt(5, 30), type: 'misc', effect: {}, qty: 1 });
          }
        });
      }

      setTimeout(() => {
        const ovEl = document.getElementById('ov-combat');
        if (ovEl) { ovEl.classList.remove('active'); ovEl.style.display = ''; }
        hideHealTargetPicker();
        G.inCombat = false; combat.active = false;
        G._acBonus = 0; G.defending = false;
        if (G.mpMax > 0) {
          const regen = Math.max(1, Math.floor(G.mpMax * 0.3));
          G.mp = Math.min(G.mpMax, G.mp + regen);
          addLog(`Recovered ${regen} MP after combat.`, 'sys');
        }
        if (coopIsHost) coopBroadcastCombatEnd(true, xpGain, goldGain);
        updateHUD();
        while (G.xp >= G.xpNext) doLevelUp();
        saveGame(); render();
      }, 1200);
      return true;
    }

    // Defeat
    if (G.hp <= 0) {
      if (checkCheatDeath()) { updateCombatBars(); return false; }
      combat.active = false;
      if (combat.animFrame) { cancelAnimationFrame(combat.animFrame); combat.animFrame = null; }
      addCombatLog('You have fallen…', 'hit');
      setTimeout(() => {
        document.getElementById('ov-combat').classList.remove('active');
        G.inCombat = false;
        G._acBonus = 0; G.defending = false;
        triggerDeath();
      }, 1000);
      return true;
    }

    return false;
  };

  console.log('[Fix 3] ✅ makeEnemy handles MONSTER_DEFS (.hp), grantCombatLoot on victory only');


  // ══════════════════════════════════════════════════════════════
  // FIX 4: Quick slot items — add saveGame() after use
  // ══════════════════════════════════════════════════════════════

  window.useActiveSlotInCombat = function useActiveSlotInCombat(idx) {
    const item = G.activeSlots?.[idx];
    if (!item) return;
    applyItemEffect(item);
    item.qty = (item.qty || 1) - 1;
    if (item.qty <= 0) G.activeSlots[idx] = null;
    addCombatLog(`Used ${item.name}.`, 'sys');
    buildCombatQuickSlots();
    updateHUD();
    saveGame(); // ← was missing
  };

  console.log('[Fix 4] ✅ Quick slots save after use');


  // ══════════════════════════════════════════════════════════════
  // FIX 5: Inventory full false positive — filter nulls before count
  // ══════════════════════════════════════════════════════════════

  window.addToInventory = function addToInventory(itemDef) {
    if (!itemDef?.name) return false;
    // Clean null holes first
    G.inventory = G.inventory.filter(Boolean);
    // Stack potions
    const existing = G.inventory.find(i => i?.name === itemDef.name && itemDef.type === 'potion');
    if (existing) { existing.qty = (existing.qty || 1) + 1; buildInventoryUI(); return true; }
    // Real capacity check
    if (G.inventory.length < 20) {
      G.inventory.push({ ...itemDef, qty: itemDef.qty || 1 });
      buildInventoryUI();
      return true;
    }
    toast('Inventory full!', 'err');
    return false;
  };

  console.log('[Fix 5] ✅ addToInventory filters null holes before capacity check');


  // ══════════════════════════════════════════════════════════════
  // FIX 6: Zone level — return 0 in dungeon/town/non-central worlds
  // ══════════════════════════════════════════════════════════════

  window.getZoneLevel = function getZoneLevel() {
    const GS = window.GameState;
    const G  = window.G;
    if (!G) return 0;
    if (GS?.mode === 'dungeon' || GS?.mode === 'town') {
      // Use world tier as proxy so monster difficulty still scales
      return (window.worldTier?.(GS?.currentWorldId) ?? 0) * 5;
    }
    // On non-central worlds, use tier-based flat zone
    const worldId = GS?.currentWorldId || 'overworld_C';
    if (worldId !== 'overworld_C' && worldId !== 'overworld_generated') {
      return (window.worldTier?.(worldId) ?? 0) * 5 + 3;
    }
    return Math.min(15, Math.floor(Math.sqrt((G.x - 120) ** 2 + (G.y - 90) ** 2) / 15));
  };

  console.log('[Fix 6] ✅ getZoneLevel mode-aware, zone hints only on central overworld');


  // ══════════════════════════════════════════════════════════════
  // FIX 7: Ability picker — ov-levelup blocks clicks on ov-ability
  // Root cause: both overlays are active simultaneously, levelup is on top
  // Fix: close levelup BEFORE showing ability overlay
  // ══════════════════════════════════════════════════════════════

  window.showAbilityChoice = function showAbilityChoice(level) {
    // ALWAYS close levelup first — it was blocking clicks
    document.getElementById('ov-levelup')?.classList.remove('active');

    const CA = window.CLASS_ABILITIES;
    if (!CA) { addLog('No ability data available.', 'sys'); updateHUD(); return; }

    const G = window.G;
    if (!G?.cls) { updateHUD(); return; }

    const clsId   = G.cls?.id || G.cls?.name?.toLowerCase()?.replace(/\s+/g, '_');
    const clsName = G.cls?.name?.toLowerCase();
    let pool = CA[clsId] || CA[clsName] || null;
    if (!pool) {
      const key = Object.keys(CA).find(k => k.toLowerCase() === clsId || k.toLowerCase() === clsName);
      if (key) pool = CA[key];
    }
    if (!pool?.length) pool = CA['fighter'] || CA[Object.keys(CA)[0]] || [];

    const owned     = new Set((G.abilities || []).map(a => a.name || a));
    const available = pool.filter(a => {
      const tier = a.level || a.minLevel || 1;
      return tier <= level && !owned.has(a.name);
    });

    if (!available.length) {
      addLog('All abilities for this level already learned.', 'sys');
      toast('Max abilities for your level!');
      updateHUD();
      return;
    }

    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const choices  = shuffled.slice(0, 3);

    document.getElementById('ab-level-label').textContent = `Level ${level} Milestone`;
    document.getElementById('ab-instruct').textContent =
      `${G.name}, you have grown in power. Choose one ability:`;

    const grid = document.getElementById('ab-grid');
    if (!grid) { updateHUD(); return; }
    grid.innerHTML = '';

    choices.forEach(ab => {
      const card = document.createElement('div');
      card.className = 'ab-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="ab-card-icon">${ab.icon || '✦'}</div>
        <div class="ab-card-name">${ab.name}</div>
        <div class="ab-card-desc">${ab.desc || ''}</div>
        ${ab.passive
          ? '<div class="ab-card-tag">Passive</div>'
          : '<div class="ab-card-tag active-tag">Active</div>'}
      `;
      card.onclick = () => {
        if (!G.abilities) G.abilities = [];
        G.abilities.push(ab);
        if (ab.effect) Object.assign(G.passives || (G.passives = {}), ab.effect);
        addLog(`✦ Gained ability: ${ab.name}!`, 'disc');
        toast(`✦ New ability: ${ab.name}!`);
        document.getElementById('ov-ability')?.classList.remove('active');
        recalcStats(); updateHUD(); saveGame();
      };
      grid.appendChild(card);
    });

    // Two rAF delay so levelup fully closes before ability opens
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById('ov-ability')?.classList.add('active');
    }));
  };

  // Patch doLevelUp button to explicitly close levelup before showing ability picker
  const _origDoLevelUp = window.doLevelUp;
  window.doLevelUp = function doLevelUp() {
    _origDoLevelUp?.();
    const btn = document.getElementById('lvlup-continue-btn');
    if (!btn) return;
    const G  = window.G;
    const isAbilityLevel = [3, 5, 7, 9, 11, 13, 15].includes(G?.level);
    if (isAbilityLevel) {
      btn.textContent = 'Choose Ability →';
      btn.onclick = () => {
        document.getElementById('ov-levelup')?.classList.remove('active');
        showAbilityChoice(G.level);
      };
    } else {
      btn.textContent = 'Continue →';
      btn.onclick = () => {
        document.getElementById('ov-levelup')?.classList.remove('active');
        updateHUD();
      };
    }
  };

  console.log('[Fix 7] ✅ Ability picker — levelup closed before ability overlay opens');


  // ══════════════════════════════════════════════════════════════
  // FIX 8: Respawn — second definition in index.html overwrites first
  // We redefine it here (loads last) with correct world restoration
  // ══════════════════════════════════════════════════════════════

  window.respawn = function respawn() {
    const G  = window.G;
    const GS = window.GameState;
    if (!G) return;

    // XP penalty — lose 25% of total XP
    const calcTotalXp = () => {
      let total = 0, xpN = 200;
      for (let l = 1; l < G.level; l++) { total += xpN; xpN = Math.floor(xpN * 1.35); }
      return total + G.xp;
    };
    const totalXp   = calcTotalXp();
    const lostXp    = Math.floor(totalXp * 0.25);
    const remaining = Math.max(0, totalXp - lostXp);
    let lvl = 1, xpN = 200, acc = 0;
    while (acc + xpN <= remaining) { acc += xpN; lvl++; xpN = Math.floor(xpN * 1.35); }
    G.level  = lvl;
    G.xp     = remaining - acc;
    G.xpNext = xpN;

    recalcStats();
    G.hp   = Math.max(1, Math.floor(G.hpMax * 0.4));
    G.mp   = Math.floor(G.mpMax * 0.4);
    G.gold = Math.max(0, Math.floor(G.gold * 0.75));
    G.inCombat = false;
    G.inTown   = false;
    if (G.passives?._cheatDeathUsed) delete G.passives._cheatDeathUsed;

    // Restore to central overworld
    if (GS) {
      GS.mode = 'world';
      GS.currentWorldId = 'overworld_C';
      if (GS.returnMap) {
        GS.activeMap = GS.returnMap;
        GS.returnMap = null;
      }
      G.x = 120; G.y = 90;
      G.prevX = G.x; G.prevY = G.y;
      GS.player = G;
      if (GS.activeMap) {
        window.MAP_W = GS.activeMap.width;
        window.MAP_H = GS.activeMap.height;
      }
    } else {
      G.x = 120; G.y = 90;
    }

    document.getElementById('ov-death')?.classList.remove('active');
    addLog(`You rise again at Level ${G.level}. Lost ${lostXp} XP and 25% gold.`, 'sys');
    updateHUD(); saveGame(); render();
    updateMinimapMode();
  };

  console.log('[Fix 8] ✅ Respawn restores world context (overwrites duplicate definition)');


  // ══════════════════════════════════════════════════════════════
  // FIX 9: World bosses — fix old variable references
  // startBossMovement() references `PASSABLE` (old Set) and `worldMap` array
  // In new engine: use window.PASSABLE_TILES and GameState.activeMap
  // ══════════════════════════════════════════════════════════════

  window.startBossMovement = function startBossMovement() {
    setInterval(() => {
      try {
        const G  = window.G;
        const GS = window.GameState;
        if (!G || G.inCombat) return;

        // Only run boss movement on overworlds, not dungeons/towns
        if (GS?.mode === 'dungeon' || GS?.mode === 'town') return;

        const map = GS?.activeMap;
        const W   = map?.width  || 240;
        const H   = map?.height || 180;

        window.worldBosses?.forEach(b => {
          if (!b.alive) return;

          // Clamp positions to current map bounds
          b.x = Math.max(2, Math.min(W - 3, b.x));
          b.y = Math.max(2, Math.min(H - 3, b.y));
          b.homeX = Math.min(b.homeX ?? b.x, W - 5);
          b.homeY = Math.min(b.homeY ?? b.y, H - 5);

          const dist = Math.sqrt((G.x - b.x) ** 2 + (G.y - b.y) ** 2);

          // Enrage — only if same world
          if (dist <= 3) {
            const onSameWorld = !GS?.currentWorldId ||
              GS.currentWorldId === 'overworld_C' ||
              GS.currentWorldId === 'overworld_generated';
            if (!G.inCombat && onSameWorld) {
              addLog(`⚠ ${b.name} ENRAGES!`, 'combat');
              toast(`⚠ ${b.name} ENRAGES!`);
              triggerWorldBossCombat(b);
            }
            return;
          }

          let nx = b.x, ny = b.y;
          if (dist <= 60) {
            // Chase
            const sx = Math.sign(G.x - b.x), sy = Math.sign(G.y - b.y);
            if (Math.abs(G.x - b.x) >= Math.abs(G.y - b.y)) nx = b.x + sx;
            else ny = b.y + sy;
            if (dist <= 20 && !b._warned) {
              b._warned = true;
              toast(`⚠ ${b.name} has spotted you!`, 'err');
              addLog(`⚠ ${b.name} turns its gaze upon you!`, 'combat');
            }
          } else {
            // Roam
            b._warned = false;
            nx = b.x + Math.round((Math.random() - 0.5) * 3);
            ny = b.y + Math.round((Math.random() - 0.5) * 3);
            if (Math.abs(nx - b.homeX) > 20) nx = b.homeX + Math.sign(b.homeX - nx) * 18;
            if (Math.abs(ny - b.homeY) > 20) ny = b.homeY + Math.sign(b.homeY - ny) * 18;
          }

          nx = Math.max(2, Math.min(W - 3, nx));
          ny = Math.max(2, Math.min(H - 3, ny));

          // Use new engine passability check
          const tile = map?.getTile?.(nx, ny) ?? 0;
          const passable = window.PASSABLE_TILES || new Set([0,1,4,5,6,7]);
          if (passable.has(tile)) { b.x = nx; b.y = ny; }
        });
      } catch (e) { /* guard */ }
    }, 1500);
  };

  console.log('[Fix 9] ✅ startBossMovement uses new engine variables');


  // ══════════════════════════════════════════════════════════════
  // FIX 10: Town shop tier labels
  // ══════════════════════════════════════════════════════════════

  const _origShowTownServicePanel = window.showTownServicePanel;
  window.showTownServicePanel = function showTownServicePanel(svcType, town) {
    _origShowTownServicePanel?.(svcType, town);
    if (svcType !== 'shop') return;
    // Calculate tier from town position
    const tier = window.getTownTier?.(town) ??
      Math.min(3, Math.floor(Math.sqrt(((town?.x || 120) - 120) ** 2 + ((town?.y || 90) - 90) ** 2) / 50));
    const tierNames = [
      "Traveller's Essentials",
      "Adventurer's Stock",
      "Veteran's Arsenal",
      "Champion's Cache"
    ];
    const tierColors = ['#888', '#4a9eff', '#c060ff', '#ffd700'];
    setTimeout(() => {
      const panel = document.getElementById('town-service-panel');
      if (!panel) return;
      let label = document.getElementById('tsp-tier-label');
      if (!label) {
        label = document.createElement('div');
        label.id = 'tsp-tier-label';
        label.style.cssText = 'font-size:.58rem;letter-spacing:2px;margin-top:3px;' +
          'font-family:"Cinzel",serif;text-align:center;';
        panel.querySelector(':first-child')?.appendChild(label);
      }
      label.style.color = tierColors[tier] || '#888';
      label.textContent = `✦ ${tierNames[tier] || 'Wares'} ✦`;
    }, 50);
  };

  console.log('[Fix 10] ✅ Town shop tier labels');


  // ══════════════════════════════════════════════════════════════
  // FIX 11: fillCharSheet null inventory crash
  // ══════════════════════════════════════════════════════════════

  const _origFillCharSheet = window.fillCharSheet;
  window.fillCharSheet = function fillCharSheet() {
    const G = window.G;
    if (G?.inventory) G.inventory = G.inventory.filter(Boolean);
    _origFillCharSheet?.();
  };

  console.log('[Fix 11] ✅ fillCharSheet filters null inventory items');


  // ══════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════

  console.log('%c ✅ Realm of Echoes — All 11 Fixes Applied %c',
    'background:#c9a227;color:#000;padding:3px 10px;font-weight:bold;border-radius:3px;', '');

})();
