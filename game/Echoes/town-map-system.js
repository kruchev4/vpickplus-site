/**
 * REALM OF ECHOES — Town Map System (Fixed)
 * Towns load as canvas maps. Services triggered by walking onto special tiles.
 *
 * FIXES vs previous version:
 *  1. enterTown/enterTownMap name conflict resolved — single function, both names point to it
 *  2. tryMove patch removed — bugfixes.js handles all movement, no conflict
 *  3. isTown flag now set on the NEW map object after it's built, not the old one
 *  4. State set exactly once, after map is ready
 *  5. leaveTownMap fixed — no stale enterTownMap reference, mode set once
 *  6. showTownServicePanel exposed on window so external wrappers can find it
 *  7. getTownTier defined here (was missing, caused ReferenceError)
 */

(function installTownMapSystem() {

  // ══════════════════════════════════════════════════════════════
  // TILE CONSTANTS
  // ══════════════════════════════════════════════════════════════

  const T = {
    FLOOR:20, WALL:21, INN:22, SHOP:23,
    TEMPLE:24, TAVERN:25, VENDOR:26, CRAFT:27,
    EXIT:28, DECO:29,
  };
  window.TOWN_TILES = T;

  const TOWN_PASSABLE = new Set([T.FLOOR,T.INN,T.SHOP,T.TEMPLE,T.TAVERN,T.VENDOR,T.CRAFT,T.EXIT]);
  window.TOWN_PASSABLE = TOWN_PASSABLE;

  const TILE_SERVICE = {
    [T.INN]:'inn', [T.SHOP]:'shop', [T.TEMPLE]:'temple',
    [T.TAVERN]:'tavern', [T.VENDOR]:'vendor', [T.CRAFT]:'craft',
  };

  const SERVICE_CFG = {
    inn:    { icon:'🏨', label:'Inn',       color:'#c8824a' },
    shop:   { icon:'⚒',  label:'Shop',      color:'#4a9eff' },
    temple: { icon:'✝',  label:'Temple',    color:'#c090ff' },
    tavern: { icon:'🍺', label:'Tavern',    color:'#c8a84a' },
    vendor: { icon:'💰', label:'Fence',     color:'#60c070' },
    craft:  { icon:'⚗',  label:'Alchemist', color:'#60c0c0' },
  };

  window.TOWN_TILE_COLORS = {
    20:'#6a6058', 21:'#1e1810', 22:'#7a5030', 23:'#1a3a5a',
    24:'#4a2a6a', 25:'#3a2808', 26:'#1a3a1a', 27:'#102a2a',
    28:'#1a4a1a', 29:'#252015',
  };
  window.TOWN_TILE_ICONS = { 22:'🏨', 23:'⚒', 24:'✝', 25:'🍺', 26:'💰', 27:'⚗', 28:'🌍' };


  // ══════════════════════════════════════════════════════════════
  // FIX 7: getTownTier — was referenced but never defined
  // ══════════════════════════════════════════════════════════════

  window.getTownTier = function getTownTier(town) {
    if (!town) return 0;
    const worldId = window.GameState?.currentWorldId || 'overworld_C';
    const wt = window.worldTier?.(worldId) ?? 0;
    if (wt > 0) return Math.min(3, wt);
    const tx = town.x ?? 120, ty = town.y ?? 90;
    return Math.min(3, Math.floor(Math.sqrt((tx-120)**2 + (ty-90)**2) / 40));
  };


  // ══════════════════════════════════════════════════════════════
  // PROCEDURAL TOWN GENERATOR
  // ══════════════════════════════════════════════════════════════

  function generateTownMap(town) {
    const W = 40, H = 40;
    const tiles = new Array(W * H).fill(T.FLOOR);
    const set  = (x,y,t) => { if(x>=0&&x<W&&y>=0&&y<H) tiles[y*W+x]=t; };
    const fill = (x1,y1,x2,y2,t) => { for(let y=y1;y<=y2;y++) for(let x=x1;x<=x2;x++) set(x,y,t); };

    // Border walls
    for(let i=0;i<W;i++){ set(i,0,T.WALL); set(i,H-1,T.WALL); }
    for(let i=0;i<H;i++){ set(0,i,T.WALL); set(W-1,i,T.WALL); }

    // Exit gap in south wall
    set(19,H-1,T.EXIT); set(20,H-1,T.EXIT); set(21,H-1,T.EXIT);

    // INN — top-left
    fill(2,2,10,9,T.WALL); fill(3,3,9,8,T.FLOOR); fill(5,4,8,7,T.INN);
    set(6,9,T.INN); set(7,9,T.INN);

    // SHOP — top-right
    fill(29,2,37,9,T.WALL); fill(30,3,36,8,T.FLOOR); fill(31,4,35,7,T.SHOP);
    set(32,9,T.SHOP); set(33,9,T.SHOP);

    // TEMPLE — top-center
    fill(16,2,23,10,T.WALL); fill(17,3,22,9,T.FLOOR); fill(18,4,21,8,T.TEMPLE);
    set(19,10,T.TEMPLE); set(20,10,T.TEMPLE);

    // TAVERN — mid-left
    fill(2,15,10,23,T.WALL); fill(3,16,9,22,T.FLOOR); fill(4,17,8,21,T.TAVERN);
    set(6,23,T.TAVERN); set(7,23,T.TAVERN);

    // VENDOR — mid-right
    fill(29,15,37,23,T.WALL); fill(30,16,36,22,T.FLOOR); fill(31,17,35,21,T.VENDOR);
    set(32,23,T.VENDOR); set(33,23,T.VENDOR);

    // CRAFT — bottom-left
    fill(2,28,12,36,T.WALL); fill(3,29,11,35,T.FLOOR); fill(4,30,10,34,T.CRAFT);
    set(7,36,T.CRAFT); set(8,36,T.CRAFT);

    // Fountain — center
    fill(15,15,24,24,T.FLOOR); fill(17,17,22,22,T.DECO);

    // Tier 2+: second shop
    if (window.getTownTier(town) >= 2) {
      fill(27,28,37,36,T.WALL); fill(28,29,36,35,T.FLOOR); fill(29,30,35,34,T.SHOP);
      set(31,36,T.SHOP); set(32,36,T.SHOP);
    }

    // Entry corridor from south
    for(let y=H-3;y<H-1;y++){ set(19,y,T.FLOOR); set(20,y,T.FLOOR); set(21,y,T.FLOOR); }

    // FIX 3: isTown set on THIS map object, not the old activeMap
    return {
      id:      town.id || town.name?.toLowerCase().replace(/\s+/g,'_') || 'town',
      name:    town.name || 'Town',
      type:    'town',
      isTown:  true,
      width:W, height:H, tiles,
      entry:   { x:20, y:H-2 },
      exit:    { x:20, y:H-1 },
      generated: true,
      getTile(x,y) {
        if(x<0||y<0||x>=this.width||y>=this.height) return T.WALL;
        return this.tiles[y*this.width+x] ?? T.WALL;
      }
    };
  }
  window.generateTownMap = generateTownMap;


  // ══════════════════════════════════════════════════════════════
  // FIX 1: Single enterTownMap function — no name conflicts
  // FIX 3: isTown set on new map AFTER it's assigned to GS.activeMap
  // FIX 4: All state set together in one place, after map is ready
  // ══════════════════════════════════════════════════════════════

  async function enterTownMap(town) {
    const GS = window.GameState;
    const G  = window.G;
    if (!GS || !G) return;

    document.getElementById('ov-town')?.classList.remove('active');
    closeTownServicePanel();

    // Save world return point BEFORE switching activeMap
    GS.returnMap = GS.activeMap;
    GS.returnX   = G.x;
    GS.returnY   = G.y;

    window.toast?.(`Entering ${town.name}…`);

    // Try Supabase
    let townMap = null;
    const supabase = window.supabaseClient;
    const townId   = town.id || town.name?.toLowerCase().replace(/\s+/g,'_');

    if (supabase && townId) {
      try {
        const { data, error } = await supabase
          .from('maps').select('json')
          .eq('id', townId).eq('type','town').maybeSingle();
        if (!error && data?.json) {
          const raw   = typeof data.json === 'string' ? JSON.parse(data.json) : data.json;
          const tiles = Array.isArray(raw.tiles) ? raw.tiles : Array.from(raw.tiles||[]);
          townMap = {
            ...raw, tiles,
            isTown: true,  // FIX 3: set on the new map
            getTile(x,y) {
              if(x<0||y<0||x>=this.width||y>=this.height) return T.WALL;
              return this.tiles[y*this.width+x] ?? T.WALL;
            }
          };
        }
      } catch(e) {
        console.warn('[enterTownMap] Supabase failed, using generated map:', e.message);
      }
    }

    if (!townMap) townMap = generateTownMap(town); // already has isTown:true

    // FIX 4: Set ALL state together, after map is built
    GS.activeMap   = townMap;
    GS.mode        = 'town';
    GS.currentTown = town;
    G.inTown       = false;  // never block movement with this flag
    G.inCombat     = false;
    window.currentTown = town;
    window.MAP_W   = townMap.width;
    window.MAP_H   = townMap.height;

    // Spawn at entry
    const ex = townMap.entry?.x ?? Math.floor(townMap.width/2);
    const ey = townMap.entry?.y ?? townMap.height - 2;
    G.x = ex; G.y = ey; G.prevX = ex; G.prevY = ey;
    GS.player = G;

    // Full fog reveal for town
    window._worldVisitedTiles = window._visitedTiles;
    window._visitedTiles = new Set();
    for(let y=0;y<townMap.height;y++)
      for(let x=0;x<townMap.width;x++)
        window._visitedTiles.add(`${x},${y}`);

    window.updateMinimapMode?.();
    window.addLog?.(`You enter ${town.name}.`, 'disc');
    window.playSound?.('town');
    window.updateHUD?.();
    window.render?.();
    showTownNameBanner(town.name);
  }

  // FIX 1: Both names point to the same function — no confusion, no recursion
  window.enterTownMap = enterTownMap;
  window.enterTown    = enterTownMap;


  // ══════════════════════════════════════════════════════════════
  // FIX 5: leaveTownMap — mode set once, no stale reference
  // ══════════════════════════════════════════════════════════════

  function leaveTownMap() {
    const GS = window.GameState;
    const G  = window.G;
    if (!GS || !G) return;

    closeTownServicePanel();
    document.getElementById('town-exit-prompt')?.remove();

    if (GS.returnMap) {
      GS.activeMap = GS.returnMap;
      GS.returnMap = null;
    }

    G.x = GS.returnX ?? G.x;
    G.y = GS.returnY ?? G.y;
    G.prevX = G.x; G.prevY = G.y;

    // FIX 5: set state exactly once
    GS.mode        = 'world';
    GS.currentTown = null;
    G.inTown       = false;
    G.inCombat     = false;
    window.currentTown = null;
    window.MAP_W   = GS.activeMap.width;
    window.MAP_H   = GS.activeMap.height;
    GS.player      = G;

    // Restore world fog
    window._visitedTiles = window._worldVisitedTiles || window._visitedTiles || new Set();
    window._worldVisitedTiles = null;

    G.encounterCooldown = 15;

    window.updateMinimapMode?.();
    window.addLog?.('You step back into the world.', 'disc');
    window.updateHUD?.();
    window.render?.();
  }

  window.leaveTownMap = leaveTownMap;
  window.leaveTown    = leaveTownMap;


  // ══════════════════════════════════════════════════════════════
  // TILE INTERACTION
  // ══════════════════════════════════════════════════════════════

  window.handleTownTile = function handleTownTile(tileType, x, y) {
    if (tileType === T.EXIT) { showExitPrompt(); return; }
    const svcType = TILE_SERVICE[tileType];
    if (svcType) {
      const town = window.GameState?.currentTown || window.currentTown;
      showTownServicePanel(svcType, town);
    }
  };

  // FIX 2: NO tryMove patch here — bugfixes.js handles all movement
  // This avoids the stale _origTryMove chain conflict entirely.


  // ══════════════════════════════════════════════════════════════
  // FLOATING SERVICE PANEL
  // FIX 6: exposed on window so external code can find it
  // ══════════════════════════════════════════════════════════════

  let _servicePanelOpen = null;

  function showTownServicePanel(svcType, town) {
    if (_servicePanelOpen === svcType) return;
    closeTownServicePanel();
    _servicePanelOpen = svcType;

    const cfg  = SERVICE_CFG[svcType] || { icon:'🏠', label:svcType, color:'#888' };
    const tier = window.getTownTier(town);
    const tierNames  = ["Traveller's Essentials","Adventurer's Stock","Veteran's Arsenal","Champion's Cache"];
    const tierColors = ['#888','#4a9eff','#c060ff','#ffd700'];
    const tierLabel  = svcType === 'shop'
      ? `<div style="font-size:.55rem;color:${tierColors[tier]};letter-spacing:2px;margin-top:2px;">✦ ${tierNames[tier]} ✦</div>`
      : '';

    const panel = document.createElement('div');
    panel.id = 'town-service-panel';
    panel.style.cssText = `
      position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
      z-index:200; background:linear-gradient(160deg,#0e0a06,#06030a);
      border:1px solid ${cfg.color}88; border-radius:6px;
      padding:16px 20px; min-width:320px; max-width:480px;
      max-height:60vh; overflow-y:auto; font-family:'Cinzel',serif;
      box-shadow:0 4px 30px rgba(0,0,0,.7), 0 0 20px ${cfg.color}22;
    `;
    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;
        margin-bottom:12px;border-bottom:1px solid ${cfg.color}44;padding-bottom:10px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1.4rem;">${cfg.icon}</span>
          <div>
            <div style="font-size:.8rem;color:${cfg.color};letter-spacing:2px;">${cfg.label}</div>
            <div style="font-size:.6rem;color:var(--parch-dk,#9a8a6a);">${town?.name||'Town'}</div>
            ${tierLabel}
          </div>
        </div>
        <button id="tsp-close" style="background:transparent;border:1px solid rgba(74,46,16,.5);
          color:var(--parch-dk,#9a8a6a);font-family:'Cinzel',serif;font-size:.6rem;
          padding:4px 10px;cursor:pointer;border-radius:2px;">✕ Close</button>
      </div>
      <div id="tsp-body">${buildServiceContent(svcType, town)}</div>
    `;
    document.body.appendChild(panel);
    document.getElementById('tsp-close').onclick = closeTownServicePanel;

    window._tspCheckInterval = setInterval(() => {
      const G  = window.G;
      const GS = window.GameState;
      if (!G || GS?.mode !== 'town' || !GS?.activeMap) { closeTownServicePanel(); return; }
      if (TILE_SERVICE[GS.activeMap.getTile(G.x,G.y)] !== svcType) closeTownServicePanel();
    }, 500);
  }

  // FIX 6: exposed on window
  window.showTownServicePanel = showTownServicePanel;

  function closeTownServicePanel() {
    clearInterval(window._tspCheckInterval);
    document.getElementById('town-service-panel')?.remove();
    _servicePanelOpen = null;
  }
  window.closeTownServicePanel = closeTownServicePanel;


  // ══════════════════════════════════════════════════════════════
  // SERVICE CONTENT
  // ══════════════════════════════════════════════════════════════

  function buildServiceContent(svcType, town) {
    const G    = window.G;
    const gold = G?.gold ?? 0;
    const tier = window.getTownTier(town);

    switch(svcType) {
      case 'inn': {
        const sc=5+tier*3, lc=15+tier*8;
        return `
          <div style="font-size:.68rem;color:var(--parch-dk,#9a8a6a);margin-bottom:10px;">
            Rest your weary bones. <span style="color:var(--gold,#c9a227)">💰 ${gold} gp</span>
          </div>
          <div class="tsp-option" onclick="doTownRest('short',${sc})">
            <div><div class="tsp-opt-title">Short Rest</div><div class="tsp-opt-desc">Recover 25% HP &amp; MP</div></div>
            <button class="tsp-btn${gold>=sc?'':' disabled'}">${sc} gp</button>
          </div>
          <div class="tsp-option" onclick="doTownRest('long',${lc})">
            <div><div class="tsp-opt-title">Long Rest</div><div class="tsp-opt-desc">Full HP &amp; MP recovery</div></div>
            <button class="tsp-btn${gold>=lc?'':' disabled'}">${lc} gp</button>
          </div>`;
      }

      case 'shop': {
        const shopItems = window.buildShopForTown?.(town) || window.SHOP_ITEMS || [];
        window._townShopItems = shopItems;
        if (!shopItems.length) return '<div style="color:var(--parch-dk,#9a8a6a);font-size:.7rem;">Nothing in stock.</div>';
        return shopItems.map((item,i) => {
          const can = gold >= item.price;
          const tc  = {common:'#aaa',uncommon:'#4a9eff',rare:'#c060ff',legendary:'#ffd700'}[item.tier||'common']||'#aaa';
          return `<div class="tsp-option" style="border-left:2px solid ${tc}40;">
            <div style="flex:1;">
              <div class="tsp-opt-title" style="color:${tc};">${item.icon||'📦'} ${item.name}</div>
              <div class="tsp-opt-desc">${item.desc||''}</div>
            </div>
            <button class="tsp-btn${can?'':' disabled'}" onclick="buyTownItem(${i})">${item.price}gp</button>
          </div>`;
        }).join('');
      }

      case 'temple': {
        const hc=10+tier*5, rc=50+tier*20;
        return `
          <div class="tsp-option" onclick="doTownTemple('heal',${hc})">
            <div><div class="tsp-opt-title">Blessing of Healing</div><div class="tsp-opt-desc">Restore 50% HP</div></div>
            <button class="tsp-btn${gold>=hc?'':' disabled'}">${hc} gp</button>
          </div>
          <div class="tsp-option" onclick="doTownTemple('revive',${rc})">
            <div><div class="tsp-opt-title">Resurrection Rite</div><div class="tsp-opt-desc">Revive at 1 HP</div></div>
            <button class="tsp-btn${gold>=rc?'':' disabled'}">${rc} gp</button>
          </div>`;
      }

      case 'tavern': {
        const rumours = (town?.rumours || [
          'Strange lights have been seen near the old ruins to the north.',
          'A merchant offered a fortune for goblin ears. Something big is coming.',
          'The old dungeon sealed itself years ago. Now the door is open again.',
          'They say the world bosses stir when the moons align.',
          'Bring enough gold and the fence asks no questions.',
        ]).slice(0,4);
        return `
          <div style="font-size:.65rem;color:var(--parch-dk,#9a8a6a);margin-bottom:10px;font-style:italic;">
            You pull up a stool. The barkeep leans in…
          </div>
          ${rumours.map(r=>`<div style="padding:8px 0;border-bottom:1px solid rgba(74,46,16,.3);
            font-size:.72rem;color:var(--parch-dk,#9a8a6a);font-style:italic;">"…${r}"</div>`).join('')}`;
      }

      case 'vendor': {
        const sellable = (G?.inventory||[]).filter(i=>i&&i.type==='misc');
        if (!sellable.length) return `<div style="color:var(--parch-dk,#9a8a6a);font-size:.7rem;font-style:italic;">
          "You got nothin' I want. Come back when you've been somewhere interesting."</div>`;
        return `
          <div style="font-size:.65rem;color:var(--parch-dk,#9a8a6a);margin-bottom:8px;font-style:italic;">
            "I don't ask questions. You get 40% of market value."
          </div>
          ${sellable.map(item => {
            const idx = G.inventory.indexOf(item);
            const val = window.sellValue?.(item) ?? Math.floor((item.price||10)*.4);
            return `<div class="tsp-option">
              <div class="tsp-opt-title">${item.icon||'📦'} ${item.name}${(item.qty||1)>1?' x'+item.qty:''}</div>
              <button class="tsp-btn" onclick="sellTownItem(${idx})">${val}gp</button>
            </div>`;
          }).join('')}
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(74,46,16,.3);
            display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:.65rem;color:var(--parch-dk,#9a8a6a);">Sell all misc loot:</span>
            <button class="tsp-btn" onclick="sellAllTownItems()">Sell All</button>
          </div>`;
      }

      case 'craft': {
        const CRAFT = window.CRAFT_RECIPES || [];
        if (!CRAFT.length) return '<div style="color:var(--parch-dk,#9a8a6a);font-size:.7rem;">No recipes available.</div>';
        return CRAFT.map((recipe,ri) => {
          const needed={};
          recipe.ingredients.forEach(ing => needed[ing]=(needed[ing]||0)+1);
          const have={};
          (G?.inventory||[]).filter(i=>i).forEach(i => have[i.name]=(have[i.name]||0)+(i.qty||1));
          const canCraft = Object.entries(needed).every(([n,c])=>(have[n]||0)>=c);
          const ingList  = Object.entries(needed).map(([n,c])=>
            `<span style="color:${(have[n]||0)>=c?'#7bc47b':'#c47b7b'};font-size:.6rem;">${c>1?c+'× ':''}${n}</span>`
          ).join(' + ');
          return `<div class="tsp-option" style="flex-direction:column;align-items:flex-start;gap:4px;">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
              <div class="tsp-opt-title">${recipe.icon||'⚗'} ${recipe.name}</div>
              <button class="tsp-btn${canCraft?'':' disabled'}" onclick="doCraft(${ri})">${canCraft?'Craft':'Missing'}</button>
            </div>
            <div>${ingList}</div>
            <div class="tsp-opt-desc">→ ${recipe.result?.desc||''}</div>
          </div>`;
        }).join('');
      }

      default:
        return `<div style="color:var(--parch-dk,#9a8a6a);font-size:.7rem;">Not available.</div>`;
    }
  }


  // ── Service action handlers ──────────────────────────────────

  window.doTownRest = function(type, cost) {
    const G = window.G; if(!G) return;
    if(G.gold < cost){ window.toast?.('Not enough gold!','err'); return; }
    G.gold -= cost;
    if(type==='short'){ G.hp=Math.min(G.hpMax,G.hp+Math.floor(G.hpMax*.25)); G.mp=Math.min(G.mpMax,G.mp+Math.floor(G.mpMax*.25)); window.addLog?.('Short rest — recovered 25% HP & MP.','sys'); window.toast?.('Short rest complete.'); }
    else { G.hp=G.hpMax; G.mp=G.mpMax; window.addLog?.('Long rest — fully recovered!','sys'); window.toast?.('Fully healed!'); }
    window.updateHUD?.(); window.saveGame?.();
    closeTownServicePanel();
    setTimeout(()=>showTownServicePanel('inn', window.GameState?.currentTown), 100);
  };

  window.buyTownItem = function(idx) {
    const G=window.G, item=window._townShopItems?.[idx];
    if(!G||!item) return;
    if(G.gold<item.price){ window.toast?.('Not enough gold!','err'); return; }
    if(!window.addToInventory?.({...item})) return;
    G.gold -= item.price;
    window.addLog?.(`Bought ${item.name} for ${item.price} gp.`,'sys');
    window.toast?.(`Purchased: ${item.name}`);
    window.playSound?.('buy');
    window.updateHUD?.(); window.saveGame?.();
    closeTownServicePanel();
    setTimeout(()=>showTownServicePanel('shop', window.GameState?.currentTown), 100);
  };

  window.doTownTemple = function(type, cost) {
    const G=window.G; if(!G) return;
    if(G.gold<cost){ window.toast?.('Not enough gold!','err'); return; }
    G.gold -= cost;
    if(type==='heal'){ G.hp=Math.min(G.hpMax,G.hp+Math.floor(G.hpMax*.5)); window.addLog?.('Temple blessing — 50% HP restored.','sys'); window.toast?.('Blessings received!'); }
    else { G.hp=1; window.addLog?.('Resurrection rite complete.','sys'); window.toast?.("Returned from death's door!"); }
    window.updateHUD?.(); window.saveGame?.();
    closeTownServicePanel();
    setTimeout(()=>showTownServicePanel('temple', window.GameState?.currentTown), 100);
  };

  window.sellTownItem = function(idx) {
    const G=window.G; if(!G) return;
    const item=G.inventory[idx]; if(!item) return;
    const val=window.sellValue?.(item)??Math.floor((item.price||10)*.4);
    G.gold+=val*(item.qty||1); G.inventory.splice(idx,1);
    window.addLog?.(`Sold ${item.name} for ${val*(item.qty||1)} gp.`,'loot');
    window.toast?.(`+${val*(item.qty||1)} gp`);
    window.updateHUD?.(); window.saveGame?.();
    closeTownServicePanel();
    setTimeout(()=>showTownServicePanel('vendor', window.GameState?.currentTown), 100);
  };

  window.sellAllTownItems = function() {
    const G=window.G; if(!G) return;
    const sellable=G.inventory.filter(i=>i&&i.type==='misc');
    if(!sellable.length){ window.toast?.('Nothing to sell!','err'); return; }
    let total=0;
    sellable.forEach(item=>{ total+=(window.sellValue?.(item)??Math.floor((item.price||10)*.4))*(item.qty||1); G.inventory.splice(G.inventory.indexOf(item),1); });
    G.gold+=total;
    window.addLog?.(`Sold all loot for ${total} gp.`,'loot');
    window.toast?.(`+${total} gp — sold everything!`);
    window.updateHUD?.(); window.saveGame?.();
    closeTownServicePanel();
    setTimeout(()=>showTownServicePanel('vendor', window.GameState?.currentTown), 100);
  };


  // ── Exit prompt ──────────────────────────────────────────────

  function showExitPrompt() {
    if(document.getElementById('town-exit-prompt')) return;
    const d=document.createElement('div');
    d.id='town-exit-prompt';
    d.style.cssText=`position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      z-index:201;background:linear-gradient(160deg,#0a0806,#060308);
      border:1px solid rgba(74,160,74,.5);border-radius:6px;
      padding:14px 20px;font-family:'Cinzel',serif;
      box-shadow:0 4px 20px rgba(0,0,0,.7);text-align:center;`;
    d.innerHTML=`
      <div style="font-size:.75rem;color:var(--parch-lt,#d4c4a0);margin-bottom:10px;">Leave town and return to the world?</div>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button onclick="leaveTownMap();document.getElementById('town-exit-prompt')?.remove();"
          style="font-family:'Cinzel',serif;font-size:.65rem;padding:6px 16px;
          border:1px solid #60c060;color:#60c060;background:rgba(40,80,40,.2);cursor:pointer;border-radius:2px;">
          🌍 Leave Town</button>
        <button onclick="document.getElementById('town-exit-prompt')?.remove();"
          style="font-family:'Cinzel',serif;font-size:.65rem;padding:6px 16px;
          border:1px solid rgba(74,46,16,.5);color:var(--parch-dk,#9a8a6a);
          background:transparent;cursor:pointer;border-radius:2px;">Stay</button>
      </div>`;
    document.body.appendChild(d);
    setTimeout(()=>d?.remove(), 8000);
  }


  // ── Town name banner ─────────────────────────────────────────

  function showTownNameBanner(name) {
    let el=document.getElementById('town-name-banner');
    if(!el){
      el=document.createElement('div'); el.id='town-name-banner';
      el.style.cssText=`position:fixed;top:80px;left:50%;transform:translateX(-50%);
        z-index:150;font-family:'Cinzel Decorative',serif;font-size:1.1rem;
        color:var(--gold-b,#c9a227);letter-spacing:4px;text-transform:uppercase;
        text-shadow:0 0 20px rgba(201,162,39,.6);pointer-events:none;
        opacity:0;transition:opacity .4s;`;
      document.body.appendChild(el);
    }
    el.textContent=name; el.style.opacity='1';
    setTimeout(()=>{ el.style.opacity='0'; }, 2500);
  }


  // ══════════════════════════════════════════════════════════════
  // CSS
  // ══════════════════════════════════════════════════════════════

  const style=document.createElement('style');
  style.textContent=`
#town-service-panel { scrollbar-width:thin; scrollbar-color:rgba(74,46,16,.5) transparent; }
.tsp-option { display:flex;align-items:center;justify-content:space-between;padding:10px 8px;border-bottom:1px solid rgba(74,46,16,.3);gap:12px; }
.tsp-option:last-child { border-bottom:none; }
.tsp-opt-title { font-size:.72rem;color:var(--parch-lt,#d4c4a0);margin-bottom:2px; }
.tsp-opt-desc  { font-size:.6rem; color:var(--parch-dk,#9a8a6a); }
.tsp-btn { font-family:'Cinzel',serif;font-size:.6rem;padding:5px 12px;border:1px solid var(--gold-b,#c9a227);color:var(--gold-b,#c9a227);background:rgba(201,162,39,.1);cursor:pointer;border-radius:2px;white-space:nowrap;flex-shrink:0;transition:background .15s; }
.tsp-btn:hover { background:rgba(201,162,39,.2); }
.tsp-btn.disabled { opacity:.4;cursor:not-allowed;pointer-events:none; }
  `;
  document.head.appendChild(style);

  console.log('[Town Map System] ✅ Loaded — all 7 issues fixed');

})();
