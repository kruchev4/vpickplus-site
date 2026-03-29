// ╔══════════════════════════════════════════════════════════════════╗
// ║   REALM OF ECHOES — COMPLETE EQUIPMENT & LOOT SYSTEM v1.0      ║
// ║   Replaces: paperdoll, loot tables, shop inventory              ║
// ║   PASTE THIS ENTIRE BLOCK into index.html, replacing the old    ║
// ║   versions of each section listed below.                        ║
// ╚══════════════════════════════════════════════════════════════════╝


// ════════════════════════════════════════════════════════════════════
// SECTION 1: MASTER ITEM DATABASE
// Replace your old SHOP_ITEMS array and any scattered item defs.
// Items have: name, icon, desc, price, type, slot, tier, effect,
//             flavour (optional), bossOnly (optional), minLevel
// ════════════════════════════════════════════════════════════════════

const ITEM_DB = {

  // ── POTIONS ──────────────────────────────────────────────────────
  health_potion:       { name:'Health Potion',        icon:'🧪', desc:'+30 HP',              price:25,  type:'potion',   tier:'common',    minLevel:1,  effect:{hp:30} },
  greater_health:      { name:'Greater Health Potion',icon:'🧪', desc:'+60 HP',              price:55,  type:'potion',   tier:'uncommon',  minLevel:5,  effect:{hp:60} },
  superior_health:     { name:'Superior Health Potion',icon:'🧪',desc:'+120 HP',             price:120, type:'potion',   tier:'rare',      minLevel:9,  effect:{hp:120} },
  mana_potion:         { name:'Mana Potion',           icon:'💧', desc:'+20 MP',              price:20,  type:'potion',   tier:'common',    minLevel:1,  effect:{mp:20} },
  greater_mana:        { name:'Greater Mana Potion',   icon:'💧', desc:'+50 MP',              price:50,  type:'potion',   tier:'uncommon',  minLevel:5,  effect:{mp:50} },
  elixir:              { name:'Elixir of Vitality',    icon:'✨', desc:'+50 HP +30 MP',       price:80,  type:'potion',   tier:'uncommon',  minLevel:4,  effect:{hp:50,mp:30} },
  antidote:            { name:'Antidote',              icon:'🌿', desc:'Cure poison',          price:15,  type:'potion',   tier:'common',    minLevel:1,  effect:{cure:'poison'} },
  elixir_of_gods:      { name:'Elixir of the Gods',    icon:'🌟', desc:'+200 HP +100 MP',     price:400, type:'potion',   tier:'legendary', minLevel:12, effect:{hp:200,mp:100},
                         flavour:'Distilled from starlight and dragon blood.' },

  // ── WEAPONS — COMMON ─────────────────────────────────────────────
  rusty_dagger:        { name:'Rusty Dagger',      icon:'🗡️', desc:'+1 ATK',           price:8,   type:'weapon', slot:'mainhand', tier:'common',   minLevel:1,  effect:{atk:1} },
  short_sword:         { name:'Short Sword',        icon:'⚔️', desc:'+3 ATK',           price:60,  type:'weapon', slot:'mainhand', tier:'common',   minLevel:1,  effect:{atk:3} },
  iron_sword:          { name:'Iron Sword',          icon:'⚔️', desc:'+4 ATK',           price:80,  type:'weapon', slot:'mainhand', tier:'common',   minLevel:2,  effect:{atk:4} },
  hand_axe:            { name:'Hand Axe',            icon:'🪓', desc:'+4 ATK',           price:75,  type:'weapon', slot:'mainhand', tier:'common',   minLevel:2,  effect:{atk:4} },
  hunting_bow:         { name:'Hunting Bow',          icon:'🏹', desc:'+3 ATK',           price:70,  type:'weapon', slot:'mainhand', tier:'common',   minLevel:2,  effect:{atk:3} },
  oak_staff:           { name:'Oak Staff',            icon:'🪄', desc:'+3 ATK (magic)',   price:65,  type:'weapon', slot:'mainhand', tier:'common',   minLevel:1,  effect:{atk:3,magic:true} },

  // ── WEAPONS — UNCOMMON ────────────────────────────────────────────
  steel_sword:         { name:'Steel Sword',         icon:'⚔️', desc:'+6 ATK',           price:180, type:'weapon', slot:'mainhand', tier:'uncommon', minLevel:4,  effect:{atk:6} },
  elven_blade:         { name:'Elven Blade',          icon:'⚔️', desc:'+7 ATK +1 DEX',   price:240, type:'weapon', slot:'mainhand', tier:'uncommon', minLevel:5,  effect:{atk:7,dex:1} },
  battle_axe:          { name:'Battle Axe',           icon:'🪓', desc:'+8 ATK',           price:220, type:'weapon', slot:'mainhand', tier:'uncommon', minLevel:5,  effect:{atk:8} },
  longbow:             { name:'Longbow',               icon:'🏹', desc:'+6 ATK',           price:200, type:'weapon', slot:'mainhand', tier:'uncommon', minLevel:4,  effect:{atk:6} },
  magic_wand:          { name:'Magic Wand',            icon:'🪄', desc:'+6 ATK (magic)',   price:220, type:'weapon', slot:'mainhand', tier:'uncommon', minLevel:4,  effect:{atk:6,magic:true} },
  bone_wand:           { name:'Bone Wand',             icon:'🦴', desc:'+7 ATK (magic)',   price:280, type:'weapon', slot:'mainhand', tier:'uncommon', minLevel:5,  effect:{atk:7,magic:true} },
  crossbow:            { name:'Crossbow',              icon:'🏹', desc:'+8 ATK +1 DEX',   price:260, type:'weapon', slot:'mainhand', tier:'uncommon', minLevel:6,  effect:{atk:8,dex:1} },

  // ── WEAPONS — RARE ────────────────────────────────────────────────
  mithril_sword:       { name:'Mithril Sword',         icon:'⚔️', desc:'+10 ATK +2 DEX',  price:600, type:'weapon', slot:'mainhand', tier:'rare',     minLevel:7,  effect:{atk:10,dex:2} },
  serpent_fang:        { name:'Serpent Fang',           icon:'🗡️', desc:'+9 ATK, poison on hit', price:550, type:'weapon', slot:'mainhand', tier:'rare', minLevel:7, effect:{atk:9,poison:true},
                         flavour:'The blade still weeps venom.' },
  war_hammer:          { name:'War Hammer',             icon:'🔨', desc:'+12 ATK -1 DEX',  price:580, type:'weapon', slot:'mainhand', tier:'rare',     minLevel:8,  effect:{atk:12,dex:-1} },
  arcane_staff:        { name:'Arcane Staff',           icon:'🔮', desc:'+11 ATK (magic) +3 WIS', price:650, type:'weapon', slot:'mainhand', tier:'rare', minLevel:8, effect:{atk:11,magic:true,wis:3} },
  eldritch_shard:      { name:'Eldritch Shard',         icon:'💎', desc:'+12 ATK (magic) +2 AC', price:700, type:'weapon', slot:'mainhand', tier:'rare', minLevel:9, effect:{atk:12,magic:true,ac:2} },
  composite_bow:       { name:'Composite Bow',          icon:'🏹', desc:'+11 ATK +2 DEX',  price:620, type:'weapon', slot:'mainhand', tier:'rare',     minLevel:8,  effect:{atk:11,dex:2} },

  // ── WEAPONS — LEGENDARY (boss only) ──────────────────────────────
  frostbite:           { name:'Frostbite',              icon:'❄️', desc:'+15 ATK, freezes enemies', price:2000, type:'weapon', slot:'mainhand', tier:'legendary', minLevel:10, bossOnly:true,
                         effect:{atk:15,freeze:true}, flavour:'Forged in the heart of the Glacial Tomb. The cold never leaves your hands.' },
  inferno_edge:        { name:'Inferno Edge',            icon:'🔥', desc:'+16 ATK, burns on hit',   price:2200, type:'weapon', slot:'mainhand', tier:'legendary', minLevel:10, bossOnly:true,
                         effect:{atk:16,burn:true}, flavour:'Pulled from the magma core of Ashspire.' },
  shadowbane:          { name:'Shadowbane',              icon:'🌑', desc:'+14 ATK +5 DEX, ignore 2 AC', price:2100, type:'weapon', slot:'mainhand', tier:'legendary', minLevel:11, bossOnly:true,
                         effect:{atk:14,dex:5,acPen:2}, flavour:'It cuts through armour like shadow through light.' },
  staff_of_aeons:      { name:'Staff of Aeons',          icon:'✨', desc:'+18 ATK (magic) +6 WIS',  price:2500, type:'weapon', slot:'mainhand', tier:'legendary', minLevel:12, bossOnly:true,
                         effect:{atk:18,magic:true,wis:6}, flavour:'Older than the realm itself.' },
  bone_sovereign:      { name:'Bone Sovereign',          icon:'💀', desc:'+17 ATK, undead deal -50% dmg', price:2300, type:'weapon', slot:'mainhand', tier:'legendary', minLevel:11, bossOnly:true,
                         effect:{atk:17,undeadWard:true}, flavour:'The Crypt King\'s own sceptre.' },
  drowned_trident:     { name:'Drowned Trident',         icon:'🔱', desc:'+16 ATK +4 CON, +HP on kill', price:2400, type:'weapon', slot:'mainhand', tier:'legendary', minLevel:12, bossOnly:true,
                         effect:{atk:16,con:4,onKillHp:8}, flavour:'The citadel\'s admiral wielded this against sea-gods.' },

  // ── ARMOR — CHEST ────────────────────────────────────────────────
  leather_armor:       { name:'Leather Armour',    icon:'🥋', desc:'+2 AC',           price:50,  type:'armor', slot:'chest', tier:'common',   minLevel:1,  effect:{ac:2} },
  chain_mail:          { name:'Chain Mail',         icon:'🛡️', desc:'+4 AC',           price:120, type:'armor', slot:'chest', tier:'common',   minLevel:3,  effect:{ac:4} },
  scale_mail:          { name:'Scale Mail',          icon:'🛡️', desc:'+5 AC',           price:200, type:'armor', slot:'chest', tier:'uncommon', minLevel:5,  effect:{ac:5} },
  plate_armor:         { name:'Plate Armour',        icon:'🛡️', desc:'+7 AC -1 DEX',   price:450, type:'armor', slot:'chest', tier:'rare',     minLevel:7,  effect:{ac:7,dex:-1} },
  mithril_plate:       { name:'Mithril Plate',       icon:'🛡️', desc:'+9 AC +1 CON',   price:800, type:'armor', slot:'chest', tier:'rare',     minLevel:9,  effect:{ac:9,con:1} },
  robes_of_arcana:     { name:'Robes of Arcana',     icon:'👘', desc:'+2 AC +4 WIS',   price:400, type:'armor', slot:'chest', tier:'rare',     minLevel:6,  effect:{ac:2,wis:4} },
  dragonscale_armor:   { name:'Dragonscale Armour',  icon:'🐉', desc:'+11 AC +2 CON',  price:2000, type:'armor', slot:'chest', tier:'legendary', minLevel:11, bossOnly:true,
                         effect:{ac:11,con:2}, flavour:'Each scale a trophy of a dead god.' },
  frozen_carapace:     { name:'Frozen Carapace',     icon:'❄️', desc:'+10 AC, cold immunity', price:1800, type:'armor', slot:'chest', tier:'legendary', minLevel:10, bossOnly:true,
                         effect:{ac:10,coldImmune:true}, flavour:'Ice that has never melted.' },

  // ── HELMETS ──────────────────────────────────────────────────────
  leather_cap:         { name:'Leather Cap',         icon:'🪖', desc:'+1 AC',           price:30,  type:'helmet', slot:'head', tier:'common',   minLevel:1,  effect:{ac:1} },
  iron_helm:           { name:'Iron Helm',            icon:'🪖', desc:'+2 AC',           price:80,  type:'helmet', slot:'head', tier:'common',   minLevel:3,  effect:{ac:2} },
  great_helm:          { name:'Great Helm',           icon:'🪖', desc:'+3 AC -1 DEX',   price:180, type:'helmet', slot:'head', tier:'uncommon', minLevel:5,  effect:{ac:3,dex:-1} },
  mage_circlet:        { name:'Mage Circlet',         icon:'👑', desc:'+1 AC +3 INT',   price:220, type:'helmet', slot:'head', tier:'uncommon', minLevel:4,  effect:{ac:1,int:3} },
  crown_of_thorns:     { name:'Crown of Thorns',      icon:'👑', desc:'+2 AC +2 STR, reflect 1 dmg', price:600, type:'helmet', slot:'head', tier:'rare', minLevel:7, effect:{ac:2,str:2,reflect:1} },
  helm_of_the_warden:  { name:'Helm of the Warden',   icon:'🪖', desc:'+5 AC +2 WIS',   price:1600, type:'helmet', slot:'head', tier:'legendary', minLevel:10, bossOnly:true,
                         effect:{ac:5,wis:2}, flavour:'The Pale Warden\'s last possession.' },

  // ── SHOULDERS ────────────────────────────────────────────────────
  pauldrons:           { name:'Iron Pauldrons',       icon:'🛡️', desc:'+2 AC',           price:90,  type:'shoulders', slot:'shoulders', tier:'common',   minLevel:3,  effect:{ac:2} },
  spiked_shoulders:    { name:'Spiked Pauldrons',     icon:'🛡️', desc:'+3 AC +1 STR',   price:240, type:'shoulders', slot:'shoulders', tier:'uncommon', minLevel:5,  effect:{ac:3,str:1} },
  cloak_of_shadow:     { name:'Cloak of Shadow',      icon:'🧥', desc:'+1 AC +3 DEX, avoid 10% encounters', price:500, type:'shoulders', slot:'shoulders', tier:'rare', minLevel:7,
                         effect:{ac:1,dex:3,encounterAvoid:0.1}, flavour:'Woven from shadow-spider silk.' },

  // ── PANTS / LEGS ─────────────────────────────────────────────────
  leather_greaves:     { name:'Leather Greaves',      icon:'👖', desc:'+1 AC',           price:35,  type:'pants', slot:'pants', tier:'common',   minLevel:1,  effect:{ac:1} },
  chain_leggings:      { name:'Chain Leggings',        icon:'👖', desc:'+2 AC',           price:100, type:'pants', slot:'pants', tier:'common',   minLevel:3,  effect:{ac:2} },
  plate_legs:          { name:'Plate Leggings',        icon:'👖', desc:'+4 AC',           price:300, type:'pants', slot:'pants', tier:'uncommon', minLevel:6,  effect:{ac:4} },
  runic_leggings:      { name:'Runic Leggings',        icon:'👖', desc:'+3 AC +2 INT',   price:500, type:'pants', slot:'pants', tier:'rare',     minLevel:8,  effect:{ac:3,int:2} },

  // ── BOOTS ────────────────────────────────────────────────────────
  leather_boots:       { name:'Leather Boots',         icon:'👢', desc:'+5 Speed',        price:40,  type:'boots', slot:'boots', tier:'common',   minLevel:1,  effect:{speed:5} },
  elven_boots:         { name:'Elven Boots',            icon:'👢', desc:'+8 Speed +1 DEX', price:120, type:'boots', slot:'boots', tier:'uncommon', minLevel:3,  effect:{speed:8,dex:1} },
  boots_of_striding:   { name:'Boots of Striding',     icon:'👢', desc:'+10 Speed +2 DEX',price:350, type:'boots', slot:'boots', tier:'rare',     minLevel:6,  effect:{speed:10,dex:2} },
  shadowstep_boots:    { name:'Shadowstep Boots',       icon:'👢', desc:'+12 Speed +3 DEX, avoid 15% encounters', price:700, type:'boots', slot:'boots', tier:'rare', minLevel:8,
                         effect:{speed:12,dex:3,encounterAvoid:0.15}, flavour:'Each step lands in silence.' },
  boots_of_the_abyss:  { name:'Boots of the Abyss',    icon:'👢', desc:'+15 Speed +4 DEX, phase through walls', price:1900, type:'boots', slot:'boots', tier:'legendary', minLevel:11, bossOnly:true,
                         effect:{speed:15,dex:4,encounterAvoid:0.2}, flavour:'The Drowned Admiral never needed a ship.' },

  // ── SHIELDS / OFFHAND ────────────────────────────────────────────
  wooden_shield:       { name:'Wooden Shield',         icon:'🛡️', desc:'+2 AC',           price:45,  type:'shield', slot:'offhand', tier:'common',   minLevel:1,  effect:{ac:2} },
  iron_shield:         { name:'Iron Shield',            icon:'🛡️', desc:'+3 AC',           price:110, type:'shield', slot:'offhand', tier:'common',   minLevel:2,  effect:{ac:3} },
  tower_shield:        { name:'Tower Shield',           icon:'🛡️', desc:'+5 AC -1 DEX',   price:280, type:'shield', slot:'offhand', tier:'uncommon', minLevel:5,  effect:{ac:5,dex:-1} },
  enchanted_buckler:   { name:'Enchanted Buckler',      icon:'🛡️', desc:'+3 AC +2 WIS',   price:400, type:'shield', slot:'offhand', tier:'rare',     minLevel:7,  effect:{ac:3,wis:2} },
  aegis_of_the_fallen: { name:'Aegis of the Fallen',   icon:'🛡️', desc:'+7 AC +3 CON, negate 1 hit/combat', price:2000, type:'shield', slot:'offhand', tier:'legendary', minLevel:11, bossOnly:true,
                         effect:{ac:7,con:3,negate:1}, flavour:'It has never broken. It never will.' },

  // ── RINGS ────────────────────────────────────────────────────────
  copper_ring:         { name:'Copper Ring',            icon:'💍', desc:'+1 ATK',          price:30,  type:'ring', slot:'ring1', tier:'common',   minLevel:1,  effect:{atk:1} },
  silver_ring:         { name:'Silver Ring',            icon:'💍', desc:'+2 ATK',          price:80,  type:'ring', slot:'ring1', tier:'common',   minLevel:2,  effect:{atk:2} },
  ring_of_strength:    { name:'Ring of Strength',       icon:'💍', desc:'+2 STR',          price:120, type:'ring', slot:'ring1', tier:'uncommon', minLevel:3,  effect:{str:2} },
  ring_of_arcana:      { name:'Ring of Arcana',         icon:'💍', desc:'+3 INT +5 MP',    price:180, type:'ring', slot:'ring1', tier:'uncommon', minLevel:4,  effect:{int:3,mp:5} },
  ring_of_protection:  { name:'Ring of Protection',     icon:'💍', desc:'+2 AC',           price:200, type:'ring', slot:'ring1', tier:'uncommon', minLevel:4,  effect:{ac:2} },
  band_of_vitality:    { name:'Band of Vitality',       icon:'💍', desc:'+3 CON +10 HP',   price:350, type:'ring', slot:'ring1', tier:'rare',     minLevel:6,  effect:{con:3,hp:10} },
  ring_of_the_sage:    { name:'Ring of the Sage',       icon:'💍', desc:'+4 WIS +4 INT',   price:500, type:'ring', slot:'ring1', tier:'rare',     minLevel:8,  effect:{wis:4,int:4} },
  ring_of_ages:        { name:'Ring of Ages',           icon:'💍', desc:'+3 to ALL stats', price:2200, type:'ring', slot:'ring1', tier:'legendary', minLevel:12, bossOnly:true,
                         effect:{str:3,dex:3,con:3,int:3,wis:3,cha:3}, flavour:'Worn by the first king of the realm.' },

  // ── NECKLACES ────────────────────────────────────────────────────
  wolf_fang_necklace:  { name:'Wolf Fang Necklace',     icon:'📿', desc:'+1 ATK +1 AC',   price:80,  type:'necklace', slot:'necklace', tier:'common',   minLevel:2,  effect:{atk:1,ac:1} },
  amulet_of_health:    { name:'Amulet of Health',       icon:'📿', desc:'+3 CON +15 HP',  price:200, type:'necklace', slot:'necklace', tier:'uncommon', minLevel:4,  effect:{con:3,hp:15} },
  pendant_of_mana:     { name:'Pendant of Mana',        icon:'📿', desc:'+3 WIS +20 MP',  price:220, type:'necklace', slot:'necklace', tier:'uncommon', minLevel:4,  effect:{wis:3,mp:20} },
  amulet_of_warding:   { name:'Amulet of Warding',      icon:'📿', desc:'+3 AC +2 CON',   price:400, type:'necklace', slot:'necklace', tier:'rare',     minLevel:7,  effect:{ac:3,con:2} },
  necklace_of_the_dragon: { name:'Necklace of the Dragon', icon:'🐉', desc:'+5 ATK +3 STR, fire resist', price:1700, type:'necklace', slot:'necklace', tier:'legendary', minLevel:10, bossOnly:true,
                         effect:{atk:5,str:3,fireResist:true}, flavour:'A tooth from Ashkar the Burned.' },

  // ── MISC LOOT (drops, not buyable) ───────────────────────────────
  goblin_ear:          { name:'Goblin Ear',     icon:'👂', desc:'Bounty item',  price:5,   type:'misc', tier:'common',   minLevel:1,  effect:{} },
  wolf_pelt:           { name:'Wolf Pelt',      icon:'🐺', desc:'Soft fur',     price:12,  type:'misc', tier:'common',   minLevel:1,  effect:{} },
  spider_silk:         { name:'Spider Silk',    icon:'🕸️', desc:'Strong fibre', price:18,  type:'misc', tier:'common',   minLevel:2,  effect:{} },
  venom_gland:         { name:'Venom Gland',    icon:'🐍', desc:'Alch. ingredient', price:22, type:'misc', tier:'common',  minLevel:2,  effect:{} },
  bone_fragment:       { name:'Bone Fragment',  icon:'🦴', desc:'Craftable',    price:10,  type:'misc', tier:'common',   minLevel:1,  effect:{} },
  troll_hide:          { name:'Troll Hide',     icon:'🟤', desc:'Tough leather',price:35,  type:'misc', tier:'uncommon', minLevel:4,  effect:{} },
  dragon_scale:        { name:'Dragon Scale',   icon:'🐉', desc:'Incredibly tough', price:120, type:'misc', tier:'rare',  minLevel:8,  effect:{} },
  shadow_essence:      { name:'Shadow Essence', icon:'🌑', desc:'Dark magic',   price:60,  type:'misc', tier:'uncommon', minLevel:5,  effect:{} },
  soul_shard:          { name:'Soul Shard',     icon:'💠', desc:'Trapped soul', price:80,  type:'misc', tier:'rare',     minLevel:7,  effect:{} },
  lich_phylactery:     { name:'Lich Phylactery',icon:'💀', desc:'Necro focus',  price:200, type:'misc', tier:'rare',     minLevel:9,  effect:{} },
  frost_crystal:       { name:'Frost Crystal',  icon:'❄️', desc:'Magical ice',  price:90,  type:'misc', tier:'rare',     minLevel:8,  effect:{} },
  magma_core:          { name:'Magma Core',     icon:'🌋', desc:'Still burning',price:110, type:'misc', tier:'rare',     minLevel:8,  effect:{} },
  ancient_rune:        { name:'Ancient Rune',   icon:'🔷', desc:'Powerful inscription', price:150, type:'misc', tier:'rare', minLevel:9, effect:{} },
  void_shard:          { name:'Void Shard',     icon:'🌀', desc:'Fragment of nothing', price:300, type:'misc', tier:'legendary', minLevel:12, effect:{} },
};

// Helper: get item by ID
function getItem(id) {
  const def = ITEM_DB[id];
  if (!def) return null;
  return { ...def, id, qty: 1 };
}


// ════════════════════════════════════════════════════════════════════
// SECTION 2: LOOT TABLES PER DUNGEON
// Each dungeon has: common[], uncommon[], rare[], legendary[] (boss only)
// ════════════════════════════════════════════════════════════════════

const DUNGEON_LOOT_TABLES = {
  goblin_warrens: {
    common:    ['goblin_ear','bone_fragment','health_potion','rusty_dagger','leather_cap'],
    uncommon:  ['short_sword','leather_armor','wolf_fang_necklace','mana_potion'],
    rare:      ['elven_blade','cloak_of_shadow','ring_of_strength'],
    legendary: ['bone_sovereign'],
  },
  mossy_hollows: {
    common:    ['spider_silk','venom_gland','health_potion','leather_boots'],
    uncommon:  ['antidote','elven_boots','leather_armor','hand_axe'],
    rare:      ['serpent_fang','shadowstep_boots','ring_of_protection'],
    legendary: ['shadowbane'],
  },
  forest_glades: {
    common:    ['wolf_pelt','spider_silk','health_potion','oak_staff'],
    uncommon:  ['elven_blade','elven_boots','mage_circlet','mana_potion'],
    rare:      ['robes_of_arcana','composite_bow','cloak_of_shadow'],
    legendary: ['staff_of_aeons'],
  },
  echoing_cavern: {
    common:    ['bone_fragment','iron_helm','chain_mail','health_potion'],
    uncommon:  ['iron_shield','pauldrons','steel_sword','elixir'],
    rare:      ['war_hammer','plate_armor','band_of_vitality'],
    legendary: ['aegis_of_the_fallen'],
  },
  sunken_ruins: {
    common:    ['health_potion','leather_greaves','wooden_shield','mana_potion'],
    uncommon:  ['chain_leggings','enchanted_buckler','longbow','elixir'],
    rare:      ['boots_of_striding','ring_of_protection','arcane_staff'],
    legendary: ['drowned_trident'],
  },
  elders_grove: {
    common:    ['wolf_pelt','spider_silk','oak_staff','mana_potion'],
    uncommon:  ['robes_of_arcana','pendant_of_mana','bone_wand','greater_mana'],
    rare:      ['ring_of_the_sage','runic_leggings','arcane_staff'],
    legendary: ['staff_of_aeons'],
  },
  frostbound_keep: {
    common:    ['frost_crystal','iron_helm','chain_mail','greater_health'],
    uncommon:  ['great_helm','plate_legs','mithril_sword','elixir'],
    rare:      ['mithril_plate','crown_of_thorns','amulet_of_warding'],
    legendary: ['frostbite','frozen_carapace','helm_of_the_warden'],
  },
  magma_pit: {
    common:    ['magma_core','iron_shield','chain_leggings','greater_health'],
    uncommon:  ['battle_axe','plate_armor','spiked_shoulders','elixir'],
    rare:      ['war_hammer','eldritch_shard','band_of_vitality'],
    legendary: ['inferno_edge','necklace_of_the_dragon'],
  },
  crypt_of_bones: {
    common:    ['bone_fragment','lich_phylactery','soul_shard','greater_health'],
    uncommon:  ['amulet_of_warding','ring_of_protection','plate_legs','elixir'],
    rare:      ['mithril_plate','ring_of_the_sage','enchanted_buckler'],
    legendary: ['bone_sovereign','aegis_of_the_fallen'],
  },
  sunken_throne: {
    common:    ['health_potion','mana_potion','iron_shield','leather_greaves'],
    uncommon:  ['chain_leggings','tower_shield','longbow','elixir'],
    rare:      ['boots_of_striding','amulet_of_warding','arcane_staff'],
    legendary: ['drowned_trident','boots_of_the_abyss'],
  },
  // Fallback for unknown dungeons
  _default: {
    common:    ['health_potion','mana_potion','bone_fragment','leather_boots'],
    uncommon:  ['short_sword','chain_mail','ring_of_strength'],
    rare:      ['elven_blade','plate_armor','band_of_vitality'],
    legendary: ['frostbite'],
  },
};

// Roll loot from a dungeon table
function rollDungeonLoot(dungeonId, isBoss = false) {
  const table = DUNGEON_LOOT_TABLES[dungeonId] || DUNGEON_LOOT_TABLES._default;
  const drops = [];

  // Common: 60% chance
  if (Math.random() < 0.60) {
    const id = table.common[Math.floor(Math.random() * table.common.length)];
    drops.push(id);
  }
  // Uncommon: 35% chance
  if (Math.random() < 0.35) {
    const id = table.uncommon[Math.floor(Math.random() * table.uncommon.length)];
    drops.push(id);
  }
  // Rare: 12% chance (higher in danger zones)
  if (Math.random() < 0.12) {
    const id = table.rare[Math.floor(Math.random() * table.rare.length)];
    drops.push(id);
  }
  // Legendary: BOSS ONLY, 40% chance
  if (isBoss && table.legendary?.length && Math.random() < 0.40) {
    const id = table.legendary[Math.floor(Math.random() * table.legendary.length)];
    drops.push(id);
  }

  return drops.map(id => getItem(id)).filter(Boolean);
}

// Roll loot from world encounters (uses zone level, not dungeon table)
function rollWorldLoot(zoneLevel) {
  const drops = [];
  const tier = zoneLevel < 3 ? 'common' : zoneLevel < 6 ? 'uncommon' : zoneLevel < 10 ? 'rare' : 'legendary';

  // Build eligible pool from ITEM_DB
  const pool = Object.entries(ITEM_DB).filter(([id, item]) => {
    if (item.bossOnly) return false;
    if (item.type === 'misc') return true; // misc always eligible
    const minL = item.minLevel || 1;
    return minL <= zoneLevel + 2;
  });

  // Common drop: 50%
  if (Math.random() < 0.50) {
    const eligible = pool.filter(([,i]) => i.tier === 'common' || i.type === 'misc');
    if (eligible.length) {
      const [id] = eligible[Math.floor(Math.random() * eligible.length)];
      drops.push(id);
    }
  }
  // Better drop based on zone: rare chance scales with zone
  const rarChance = Math.min(0.25, zoneLevel * 0.025);
  if (Math.random() < rarChance) {
    const eligible = pool.filter(([,i]) => i.tier === 'uncommon' || i.tier === 'rare');
    if (eligible.length) {
      const [id] = eligible[Math.floor(Math.random() * eligible.length)];
      drops.push(id);
    }
  }

  return drops.map(id => getItem(id)).filter(Boolean);
}


// ════════════════════════════════════════════════════════════════════
// SECTION 3: DISTANCE-SCALED SHOP INVENTORY
// Towns closer to spawn (120,90) have basic gear.
// Towns far from spawn have advanced gear + legendary potions.
// ════════════════════════════════════════════════════════════════════

// Calculate distance tier of a town from spawn (0=starter, 1=mid, 2=advanced, 3=endgame)
function getTownTier(town) {
  if (!town) return 0;
  const dx = (town.x || 0) - 120;
  const dy = (town.y || 0) - 90;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 25)  return 0; // starter
  if (dist < 60)  return 1; // mid
  if (dist < 110) return 2; // advanced
  return 3;                  // endgame
}

// Build shop inventory based on town tier
function buildShopForTown(town) {
  const tier = getTownTier(town);

  // Item pools by shop tier
  const SHOP_POOLS = {
    0: { // Starter towns — basics only
      potions:  ['health_potion','mana_potion','antidote'],
      weapons:  ['rusty_dagger','short_sword','iron_sword','hunting_bow','oak_staff'],
      armor:    ['leather_armor','leather_cap','leather_greaves','leather_boots','wooden_shield'],
      jewelry:  ['copper_ring','wolf_fang_necklace'],
    },
    1: { // Mid-tier towns
      potions:  ['health_potion','greater_health','mana_potion','elixir','antidote'],
      weapons:  ['iron_sword','steel_sword','elven_blade','battle_axe','longbow','magic_wand','bone_wand'],
      armor:    ['chain_mail','scale_mail','iron_helm','pauldrons','chain_leggings','elven_boots','iron_shield'],
      jewelry:  ['silver_ring','ring_of_strength','amulet_of_health','pendant_of_mana'],
    },
    2: { // Advanced towns
      potions:  ['greater_health','superior_health','greater_mana','elixir'],
      weapons:  ['steel_sword','mithril_sword','war_hammer','arcane_staff','composite_bow','eldritch_shard'],
      armor:    ['plate_armor','mithril_plate','great_helm','plate_legs','boots_of_striding','tower_shield','robes_of_arcana'],
      jewelry:  ['ring_of_protection','band_of_vitality','ring_of_the_sage','amulet_of_warding'],
    },
    3: { // Endgame towns — best non-legendary gear
      potions:  ['superior_health','greater_mana','elixir','elixir_of_gods'],
      weapons:  ['mithril_sword','arcane_staff','eldritch_shard','composite_bow','serpent_fang'],
      armor:    ['mithril_plate','plate_armor','crown_of_thorns','runic_leggings','shadowstep_boots','enchanted_buckler'],
      jewelry:  ['ring_of_the_sage','ring_of_arcana','amulet_of_warding','necklace_of_the_dragon','band_of_vitality'],
    },
  };

  const pool = SHOP_POOLS[tier];
  const items = [];

  // Always stock all potions for the tier
  pool.potions.forEach(id => {
    const item = getItem(id);
    if (item) items.push(item);
  });

  // Pick 3-4 weapons
  const weapons = [...pool.weapons].sort(() => Math.random() - 0.5).slice(0, 4);
  weapons.forEach(id => { const item = getItem(id); if (item) items.push(item); });

  // Pick 4-5 armor pieces
  const armors = [...pool.armor].sort(() => Math.random() - 0.5).slice(0, 5);
  armors.forEach(id => { const item = getItem(id); if (item) items.push(item); });

  // Pick 2-3 jewelry
  const jewelry = [...pool.jewelry].sort(() => Math.random() - 0.5).slice(0, 3);
  jewelry.forEach(id => { const item = getItem(id); if (item) items.push(item); });

  return items;
}

// Store current shop inventory per town (regenerates on visit)
let _currentShopItems = [];

function buildShop() {
  _currentShopItems = buildShopForTown(currentTown);
  const si = document.getElementById('shop-items');
  if (!si) return;

  si.innerHTML = _currentShopItems.map((item, i) => {
    const canAfford = G.gold >= item.price;
    const tierColor = { common:'#888', uncommon:'#4a9eff', rare:'#c060ff', legendary:'#ffd700' }[item.tier] || '#888';
    return `
      <div class="shop-item" style="border-left:2px solid ${tierColor};">
        <div style="flex:1;">
          <div class="item-name" style="color:${tierColor};">${item.icon} ${item.name}</div>
          <div class="item-stats">${item.desc}</div>
          ${item.flavour ? `<div style="font-size:.58rem;color:var(--parch-dk);font-style:italic;margin-top:2px;">"${item.flavour}"</div>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="item-price">${item.price}gp</span>
          <button class="buy-btn" onclick="buyShopItem(${i})" ${canAfford ? '' : 'disabled'}>Buy</button>
        </div>
      </div>`;
  }).join('');

  // Show tier label
  const tier = getTownTier(currentTown);
  const tierNames = ['Starter Wares', 'Adventurer\'s Stock', 'Veteran\'s Arsenal', 'Champion\'s Cache'];
  const header = document.querySelector('#svc-panel-shop .svc-panel-title');
  if (header) header.textContent = `⚒ ${tierNames[tier]}`;
}

function buyShopItem(idx) {
  const item = _currentShopItems[idx];
  if (!item) return;
  if (G.gold < item.price) { toast('Not enough gold!', 'err'); return; }
  if (!addToInventory({ ...item })) return;
  G.gold -= item.price;
  document.getElementById('town-gold-disp').textContent = G.gold;
  document.getElementById('hud-gold').textContent = G.gold;
  playSound('buy');
  addLog(`Bought ${item.name} for ${item.price} gp.`, 'sys');
  toast(`Purchased: ${item.name}`);
  buildShop(); // refresh (re-check affordability)
}

// Keep old buyItem as alias so any legacy calls still work
function buyItem(idx) { buyShopItem(idx); }


// ════════════════════════════════════════════════════════════════════
// SECTION 4: COMPLETE PAPERDOLL SYSTEM
// Replaces: buildPaperDoll, pdSlotClick, equipFromInventory,
//           unequipToInventory, buildFullInventoryUI, showInvActionPanel
// ════════════════════════════════════════════════════════════════════

// Slot definitions — order = display order in paper doll
const PD_SLOTS = [
  { id:'head',      label:'Head',       icon:'🪖', row:0, col:1 },
  { id:'necklace',  label:'Neck',       icon:'📿', row:0, col:2 },
  { id:'shoulders', label:'Shoulders',  icon:'🛡️', row:1, col:0 },
  { id:'chest',     label:'Chest',      icon:'👕', row:1, col:1 },
  { id:'offhand',   label:'Off Hand',   icon:'🛡️', row:1, col:2 },
  { id:'ring1',     label:'Ring',       icon:'💍', row:2, col:0 },
  { id:'pants',     label:'Legs',       icon:'👖', row:2, col:1 },
  { id:'ring2',     label:'Ring',       icon:'💍', row:2, col:2 },
  { id:'mainhand',  label:'Weapon',     icon:'⚔️', row:3, col:0 },
  { id:'boots',     label:'Boots',      icon:'👢', row:3, col:1 },
];

// Which item slots/types can go in each equipment slot
const SLOT_ACCEPTS_MAP = {
  head:      ['helmet','head','hat','crown'],
  shoulders: ['shoulders','pauldrons','cloak'],
  chest:     ['armor','chest','robe','tunic'],
  pants:     ['pants','leggings','greaves'],
  boots:     ['boots','shoes'],
  mainhand:  ['weapon','sword','axe','bow','staff','wand','dagger','shield'],
  offhand:   ['shield','offhand'],
  ring1:     ['ring'],
  ring2:     ['ring'],
  necklace:  ['necklace','amulet'],
};

function getEquipSlotForItem(item) {
  if (!item?.type) return null;
  // Check item.slot first (explicit)
  if (item.slot && SLOT_ACCEPTS_MAP[item.slot]) return item.slot;
  // Then check type against accepts map
  const t = item.type.toLowerCase();
  for (const [slot, types] of Object.entries(SLOT_ACCEPTS_MAP)) {
    if (types.some(a => t.includes(a) || a.includes(t))) return slot;
  }
  return null;
}

// ── Build the paper doll UI ──────────────────────────────────────────
function buildPaperDoll() {
  if (!G.equipped) G.equipped = {};

  // Build a 4-row grid layout
  const grid = document.getElementById('inv-paperdoll');
  if (!grid) return;

  // Recalc bonus stats from equipment
  const bonuses = calcEquipBonuses();

  // Clear and rebuild
  PD_SLOTS.forEach(slot => {
    const el = document.getElementById('pd-' + slot.id);
    if (!el) return;

    const item = G.equipped[slot.id];
    const tierColors = { common:'rgba(255,255,255,.15)', uncommon:'rgba(74,158,255,.4)', rare:'rgba(192,96,255,.4)', legendary:'rgba(255,215,0,.5)' };
    const tierGlow   = { uncommon:'0 0 8px rgba(74,158,255,.3)', rare:'0 0 10px rgba(192,96,255,.35)', legendary:'0 0 14px rgba(255,215,0,.4)' };

    el.style.borderColor = item ? (tierColors[item.tier] || tierColors.common) : '';
    el.style.boxShadow   = item ? (tierGlow[item.tier] || '') : '';
    el.classList.toggle('filled', !!item);
    el.classList.toggle('rare',      item?.tier === 'rare');
    el.classList.toggle('legendary', item?.tier === 'legendary');

    // Clear children except the base icon/label spans
    el.querySelectorAll('.pd-item-icon, .pd-item-name, .pd-equip-stats').forEach(e => e.remove());

    if (item) {
      const ic = document.createElement('div');
      ic.className = 'pd-item-icon';
      ic.textContent = item.icon || '📦';
      ic.style.fontSize = '1.1rem';

      const nm = document.createElement('div');
      nm.className = 'pd-item-name';
      nm.textContent = item.name;
      nm.style.cssText = 'font-size:.42rem;color:var(--parch-lt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:52px;';

      // Show key stat bonus
      const eff = item.effect || {};
      const statLine = [
        eff.atk  ? `+${eff.atk}ATK`  : '',
        eff.ac   ? `+${eff.ac}AC`    : '',
        eff.hp   ? `+${eff.hp}HP`    : '',
        eff.mp   ? `+${eff.mp}MP`    : '',
      ].filter(Boolean).join(' ');

      if (statLine) {
        const st = document.createElement('div');
        st.className = 'pd-equip-stats';
        st.textContent = statLine;
        st.style.cssText = 'font-size:.38rem;color:var(--gold-b);margin-top:1px;';
        el.appendChild(ic);
        el.appendChild(nm);
        el.appendChild(st);
      } else {
        el.appendChild(ic);
        el.appendChild(nm);
      }
    } else {
      // Empty slot — show default icon + label
      const di = el.querySelector('.pd-icon');
      const dl = el.querySelector('.pd-lbl');
      if (di) di.style.opacity = '0.25';
      if (dl) dl.style.opacity = '0.35';
    }
  });

  // Update stats summary
  buildInvStatsBox();
}

// ── Calculate total equipment bonuses ───────────────────────────────
function calcEquipBonuses() {
  const b = { atk:0, ac:0, dmg:0, hp:0, mp:0, str:0, dex:0, con:0, int:0, wis:0, cha:0, speed:0 };
  if (!G.equipped) return b;
  for (const slot of Object.keys(G.equipped)) {
    const item = G.equipped[slot];
    if (!item?.effect) continue;
    const e = item.effect;
    if (e.atk)   b.atk   += e.atk;
    if (e.ac)    b.ac    += e.ac;
    if (e.dmg)   b.dmg   += e.dmg;
    if (e.hp)    b.hp    += e.hp;
    if (e.mp)    b.mp    += e.mp;
    if (e.str)   b.str   += e.str;
    if (e.dex)   b.dex   += e.dex;
    if (e.con)   b.con   += e.con;
    if (e.int)   b.int   += e.int;
    if (e.wis)   b.wis   += e.wis;
    if (e.cha)   b.cha   += e.cha;
    if (e.speed) b.speed += e.speed;
    // Apply passive effects
    if (e.encounterAvoid) G.passives = G.passives || {}, G.passives.encounterAvoid = Math.min(0.5, (G.passives.encounterAvoid||0) + e.encounterAvoid);
    if (e.negate)         G.passives = G.passives || {}, G.passives.cheatDeath = true;
    if (e.onKillHp)       G.passives = G.passives || {}, G.passives.onKillHp = (G.passives.onKillHp||0) + e.onKillHp;
  }
  return b;
}

// ── Stats summary box ────────────────────────────────────────────────
function buildInvStatsBox() {
  const box = document.getElementById('inv-stats-box');
  if (!box) return;
  recalcStats();
  const b = calcEquipBonuses();
  box.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 10px;font-size:.62rem;">
      <span style="color:var(--parch-dk);">HP</span>     <span style="color:#c0392b;">${G.hp}/${G.hpMax}</span>
      <span style="color:var(--parch-dk);">MP</span>     <span style="color:#2980b9;">${G.mp}/${G.mpMax}</span>
      <span style="color:var(--parch-dk);">AC</span>     <span style="color:var(--parch-lt);">${G.ac}</span>
      <span style="color:var(--parch-dk);">ATK</span>    <span style="color:var(--gold-b);">+${G.atkBonus}</span>
      <span style="color:var(--parch-dk);">DMG</span>    <span style="color:var(--gold-b);">+${G.dmgBonus}</span>
      ${b.speed ? `<span style="color:var(--parch-dk);">SPD</span><span style="color:#60c080;">+${b.speed}</span>` : ''}
    </div>`;
}

// ── Slot click — opens action panel ─────────────────────────────────
function pdSlotClick(slotId) {
  const item = G.equipped?.[slotId];
  selectInventoryItem(item, slotId, 'equip');
}

// ── Unified item selection + action panel ───────────────────────────
let _selectedItem  = null;
let _selectedSlot  = null;
let _selectedType  = null; // 'carry' | 'active' | 'equip'
let _selectedIdx   = null;

function selectInventoryItem(item, slotOrIdx, type) {
  _selectedItem = item;
  _selectedSlot = slotOrIdx;
  _selectedType = type;
  _selectedIdx  = slotOrIdx;

  // Highlight selected slot
  document.querySelectorAll('.inv-slot-cell.selected, .pd-slot.selected').forEach(e => e.classList.remove('selected'));
  if (type === 'carry') {
    const cells = document.querySelectorAll('#inv-carry-grid .inv-slot-cell');
    if (cells[slotOrIdx]) cells[slotOrIdx].classList.add('selected');
  } else if (type === 'equip') {
    const el = document.getElementById('pd-' + slotOrIdx);
    if (el) el.classList.add('selected');
  }

  showInvActionPanel(item, slotOrIdx, type);
}

function showInvActionPanel(item, slotOrIdx, type) {
  const panel = document.getElementById('inv-action-panel');
  if (!panel) return;
  panel.style.display = 'flex';

  const iconEl = document.getElementById('iap-icon');
  const nameEl = document.getElementById('iap-name');
  const metaEl = document.getElementById('iap-meta');
  const btnsEl = document.getElementById('iap-btns');
  if (!iconEl || !nameEl || !metaEl || !btnsEl) return;

  if (!item) {
    iconEl.textContent = '—';
    const slotDef = PD_SLOTS.find(s => s.id === slotOrIdx);
    nameEl.textContent = slotDef ? `${slotDef.label} — Empty` : 'Empty';
    const hint = type === 'carry'  ? 'Select an item to manage it'
               : type === 'active' ? 'Drag potions here for quick use'
               :                     `Equip a ${slotDef?.label || ''} item from your bag`;
    metaEl.innerHTML = `<span style="color:var(--parch-dk);font-style:italic;font-size:.65rem;">${hint}</span>`;
    btnsEl.innerHTML = '';
    return;
  }

  // Header
  const tierColors = { common:'#aaa', uncommon:'#4a9eff', rare:'#c060ff', legendary:'#ffd700' };
  const tc = tierColors[item.tier] || '#aaa';
  iconEl.textContent  = item.icon || '📦';
  iconEl.style.filter = item.tier === 'legendary' ? 'drop-shadow(0 0 6px gold)' : '';
  nameEl.textContent  = item.name;
  nameEl.style.color  = tc;

  // Build stats description
  const eff    = item.effect || {};
  const statLines = [];
  if (eff.atk)   statLines.push(`<span style="color:var(--gold-b)">+${eff.atk} Attack</span>`);
  if (eff.ac)    statLines.push(`<span style="color:#60c0ff">+${eff.ac} Armour Class</span>`);
  if (eff.hp)    statLines.push(`<span style="color:#c0392b">+${eff.hp} HP</span>`);
  if (eff.mp)    statLines.push(`<span style="color:#2980b9">+${eff.mp} MP</span>`);
  if (eff.str)   statLines.push(`<span style="color:var(--parch-lt)">+${eff.str} STR</span>`);
  if (eff.dex)   statLines.push(`<span style="color:var(--parch-lt)">+${eff.dex} DEX</span>`);
  if (eff.con)   statLines.push(`<span style="color:var(--parch-lt)">+${eff.con} CON</span>`);
  if (eff.int)   statLines.push(`<span style="color:var(--parch-lt)">+${eff.int} INT</span>`);
  if (eff.wis)   statLines.push(`<span style="color:var(--parch-lt)">+${eff.wis} WIS</span>`);
  if (eff.speed) statLines.push(`<span style="color:#60ff90">+${eff.speed} Speed</span>`);
  if (eff.magic) statLines.push(`<span style="color:#c090ff">✦ Magical damage</span>`);
  if (eff.encounterAvoid) statLines.push(`<span style="color:#90c090">Avoid ${Math.round(eff.encounterAvoid*100)}% encounters</span>`);
  if (item.price) statLines.push(`<span style="color:var(--gold)">Worth ~${item.price}gp (sells ${sellValue(item)}gp)</span>`);

  metaEl.innerHTML = [
    `<div style="margin-bottom:4px;">${item.desc || ''}</div>`,
    statLines.join('<br>'),
    item.flavour ? `<div style="color:var(--parch-dk);font-style:italic;font-size:.6rem;margin-top:4px;">"${item.flavour}"</div>` : '',
  ].join('');

  // Action buttons
  btnsEl.innerHTML = '';
  const mk = (label, cls, fn) => {
    const b = document.createElement('button');
    b.className = 'iap-btn ' + cls;
    b.textContent = label;
    b.onclick = fn;
    btnsEl.appendChild(b);
  };

  if (type === 'carry') {
    const equipSlot = getEquipSlotForItem(item);
    const isEquipped = equipSlot && G.equipped?.[equipSlot]?.name === item.name;

    if (equipSlot && !isEquipped) {
      mk('⚔ Equip', 'equip', () => { equipFromCarry(_selectedIdx); });
    }
    if (equipSlot && isEquipped) {
      mk('↩ Unequip', 'unequip', () => { unequipToInventory(equipSlot); });
    }
    if (item.type === 'potion' || item.effect?.hp || item.effect?.mp) {
      mk('💊 Use', 'use', () => { useCarryItem(_selectedIdx); if (!G.inCombat) closeInventory(); });
    }
    if (!isEquipped && item.type !== 'potion' && (item.type !== 'misc')) {
      // Can move to active slot if consumable
    }
    if (item.type === 'potion') {
      mk('⚗ → Quick Slot', 'active', () => { moveToActiveSlot(_selectedIdx); buildCarryGrid(); buildActiveGrid(); });
    }
    mk(`Sell (${sellValue(item)}gp)`, 'sell', () => { sellItem(_selectedIdx); buildFullInventoryUI(); });

  } else if (type === 'active') {
    mk('💊 Use', 'use', () => { useActiveSlotItem(_selectedIdx); buildActiveGrid(); });
    mk('↩ To Bag', 'drop', () => { moveActiveToBag(_selectedIdx); buildFullInventoryUI(); });
    mk('✕ Remove', 'drop', () => { G.activeSlots[_selectedIdx] = null; buildActiveGrid(); saveGame(); panel.style.display = 'none'; });

  } else if (type === 'equip') {
    if (item) {
      mk('↩ Unequip', 'unequip', () => { unequipToInventory(_selectedIdx); });
    }
  }
}

// ── Equip from carry inventory ───────────────────────────────────────
function equipFromCarry(carryIdx) {
  if (!G.equipped) G.equipped = {};
  const item = G.inventory[carryIdx];
  if (!item) return;

  const slot = getEquipSlotForItem(item);
  if (!slot) { toast("Can't equip that here!", 'err'); return; }

  // If something's already in the slot, swap it to inventory
  const old = G.equipped[slot];
  if (old) {
    // Try to put old item back in the same carry slot
    G.inventory[carryIdx] = old;
  } else {
    G.inventory.splice(carryIdx, 1);
  }

  G.equipped[slot] = item;

  playSound('equip');
  addLog(`Equipped: ${item.name}.`, 'sys');
  if (item.tier === 'legendary') {
    addLog(`⭐ ${item.name} — "${item.flavour || 'a legendary weapon'}"`, 'legendary');
    toast(`⭐ Legendary: ${item.name}!`);
  } else {
    toast(`Equipped ${item.name}!`);
  }

  recalcStats();
  buildFullInventoryUI();
  updateHUD();
  saveGame();
}

// ── Unequip to inventory ─────────────────────────────────────────────
function unequipToInventory(slot) {
  if (!G.equipped?.[slot]) return;
  if (G.inventory.filter(Boolean).length >= 20) { toast('Inventory full!', 'err'); return; }

  const item = G.equipped[slot];
  G.inventory.push({ ...item });
  G.equipped[slot] = null;

  addLog(`Unequipped: ${item.name}.`, 'sys');
  recalcStats();
  buildFullInventoryUI();
  updateHUD();
  saveGame();
  toast(`Unequipped ${item.name}.`);
}

// ── Full inventory rebuild ───────────────────────────────────────────
function buildFullInventoryUI() {
  const cl = document.getElementById('inv-char-line');
  if (cl) cl.textContent = `${G.name}  ·  ${G.race?.name || '?'} ${G.cls?.name || '?'}  ·  Lv ${G.level}`;

  buildPaperDoll();
  buildCarryGrid();
  buildActiveGrid();
  buildInvStatsBox();

  const cnt = document.getElementById('inv-count');
  if (cnt) cnt.textContent = `${G.inventory.filter(Boolean).length}/20`;

  // Reset action panel
  const panel = document.getElementById('inv-action-panel');
  if (panel) panel.style.display = 'none';
}

// ── Carry grid ───────────────────────────────────────────────────────
function buildCarryGrid() {
  const grid = document.getElementById('inv-carry-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 0; i < 20; i++) {
    const item = G.inventory[i];
    const cell = document.createElement('div');
    cell.className = 'inv-slot-cell';
    if (item) {
      const tierGlow = { uncommon:'rgba(74,158,255,.25)', rare:'rgba(192,96,255,.3)', legendary:'rgba(255,215,0,.4)' };
      cell.style.background = tierGlow[item.tier] ? `radial-gradient(circle, ${tierGlow[item.tier]} 0%, transparent 70%)` : '';
      cell.textContent = item.icon || '📦';
      cell.title = `${item.name}\n${item.desc || ''}`;
      if ((item.qty || 1) > 1) {
        const q = document.createElement('span');
        q.className = 'slot-qty';
        q.textContent = item.qty;
        cell.appendChild(q);
      }
    }
    if (_selectedType === 'carry' && _selectedIdx === i) cell.classList.add('selected');
    cell.onclick = () => selectInventoryItem(item || null, i, 'carry');
    grid.appendChild(cell);
  }
}

// ── Active grid ──────────────────────────────────────────────────────
function buildActiveGrid() {
  const grid = document.getElementById('inv-active-grid');
  if (grid) {
    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const item = G.activeSlots?.[i];
      const cell = document.createElement('div');
      cell.className = 'inv-slot-cell active-slot';
      cell.title = item ? `${item.name} — click to use` : `Quick slot ${i + 1}`;
      if (item) {
        cell.textContent = item.icon || '📦';
        if ((item.qty || 1) > 1) {
          const q = document.createElement('span'); q.className = 'slot-qty'; q.textContent = item.qty;
          cell.appendChild(q);
        }
      }
      if (_selectedType === 'active' && _selectedIdx === i) cell.classList.add('selected');
      cell.onclick = () => selectInventoryItem(item || null, i, 'active');
      grid.appendChild(cell);
    }
  }
  buildLeftPanelActiveSlots();
}


// ════════════════════════════════════════════════════════════════════
// SECTION 5: UPDATE checkCombatEnd TO USE NEW LOOT TABLES
// Find your existing checkCombatEnd and replace the loot drop section
// (the part after "Loot from all enemies") with this function call.
// ════════════════════════════════════════════════════════════════════

function grantCombatLoot(enemies, dungeonId) {
  // Determine if this was a boss fight
  const isBoss = enemies.some(e => e.isBoss || e.isCampBoss);

  // Get dungeon ID from GameState if not passed
  const mapId = dungeonId
    || window.GameState?.activeMap?.id
    || '_default';

  // Roll loot
  const drops = window.GameState?.mode === 'dungeon'
    ? rollDungeonLoot(mapId, isBoss)
    : rollWorldLoot(getZoneLevel());

  drops.forEach(item => {
    if (item.tier === 'legendary') {
      addLog(`⭐ LEGENDARY DROP: ${item.name}!`, 'legendary');
      toast(`⭐ Legendary: ${item.name}!`);
    } else if (item.tier === 'rare') {
      addLog(`💎 Rare drop: ${item.icon} ${item.name}`, 'loot');
    } else {
      addLog(`Found: ${item.icon} ${item.name}`, 'loot');
    }
    addToInventory({ ...item });
  });

  return drops;
}

// ════════════════════════════════════════════════════════════════════
// SECTION 6: PAPERDOLL CSS — add inside your <style> block
// ════════════════════════════════════════════════════════════════════

const _paperdollCSS = `
/* ── Paper doll slot enhancements ── */
.pd-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  background: rgba(10,5,2,.6);
  border: 1px solid rgba(74,46,16,.5);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s, background .15s;
  overflow: hidden;
  padding: 3px;
}
.pd-slot:hover {
  border-color: var(--gold-b);
  background: rgba(20,12,4,.8);
}
.pd-slot.filled {
  border-color: rgba(120,80,30,.7);
  background: rgba(20,12,4,.9);
}
.pd-slot.filled:hover {
  border-color: var(--gold-b);
}
.pd-slot.rare {
  border-color: rgba(192,96,255,.5);
  background: rgba(30,10,40,.8);
}
.pd-slot.legendary {
  border-color: rgba(255,215,0,.6);
  background: rgba(40,30,5,.9);
  animation: legendaryPulse 2s ease-in-out infinite;
}
.pd-slot.selected {
  border-color: var(--gold-b) !important;
  background: rgba(40,25,5,.95) !important;
  box-shadow: 0 0 12px rgba(201,162,39,.4) !important;
}
@keyframes legendaryPulse {
  0%,100% { box-shadow: 0 0 8px rgba(255,215,0,.3); }
  50%      { box-shadow: 0 0 16px rgba(255,215,0,.6); }
}
.pd-icon { font-size: .9rem; opacity: .3; }
.pd-lbl  { font-size: .38rem; color: var(--parch-dk); letter-spacing: 1px; text-transform: uppercase; margin-top: 1px; }
.pd-slot.filled .pd-icon, .pd-slot.filled .pd-lbl { display: none; }
.pd-item-icon { font-size: 1.2rem; line-height: 1; }
.pd-item-name { font-size: .42rem; color: var(--parch-lt); text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 52px; margin-top: 2px; }

/* ── Inventory action panel ── */
.inv-action-panel {
  display: none;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(10,5,2,.8);
  border-top: 1px solid rgba(74,46,16,.4);
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 60px;
}
.iap-icon { font-size: 1.8rem; flex-shrink: 0; }
.iap-info { flex: 1; min-width: 120px; }
.iap-name { font-family: 'Cinzel',serif; font-size: .78rem; color: var(--parch-lt); margin-bottom: 3px; }
.iap-meta { font-size: .62rem; color: var(--parch-dk); line-height: 1.5; }
.iap-btns { display: flex; flex-wrap: wrap; gap: 5px; align-items: flex-start; }
.iap-btn  { font-family: 'Cinzel',serif; font-size: .6rem; padding: 5px 10px; border: 1px solid; cursor: pointer; border-radius: 2px; background: transparent; transition: all .15s; letter-spacing: .5px; }
.iap-btn.equip   { border-color: var(--gold-b); color: var(--gold-b); }
.iap-btn.equip:hover { background: rgba(201,162,39,.15); }
.iap-btn.unequip { border-color: var(--parch-dk); color: var(--parch-dk); }
.iap-btn.use     { border-color: #27ae60; color: #27ae60; }
.iap-btn.use:hover { background: rgba(39,174,96,.15); }
.iap-btn.sell    { border-color: var(--gold); color: var(--gold); }
.iap-btn.sell:hover { background: rgba(201,146,42,.15); }
.iap-btn.drop    { border-color: rgba(74,46,16,.6); color: var(--parch-dk); }
.iap-btn.active  { border-color: #2980b9; color: #2980b9; }

/* ── Inv slot tier glows ── */
.inv-slot-cell[data-tier="uncommon"] { border-color: rgba(74,158,255,.3) !important; }
.inv-slot-cell[data-tier="rare"]     { border-color: rgba(192,96,255,.35) !important; }
.inv-slot-cell[data-tier="legendary"]{ border-color: rgba(255,215,0,.5) !important; }
.inv-slot-cell.selected { border-color: var(--gold-b) !important; background: rgba(40,25,5,.95) !important; }

/* Shop tier colours */
.shop-item { border-left: 2px solid var(--border); }
`;

// Inject CSS
(function injectCSS() {
  const style = document.createElement('style');
  style.id = 'paperdoll-system-css';
  style.textContent = _paperdollCSS;
  document.head.appendChild(style);
})();


// ════════════════════════════════════════════════════════════════════
// SECTION 7: HOOK INTO checkCombatEnd
// We patch grantCombatLoot into the existing combat end flow.
// This replaces the old "Loot from all enemies" forEach block.
// ════════════════════════════════════════════════════════════════════

// Store reference to original checkCombatEnd and wrap it
const _origCheckCombatEnd = window.checkCombatEnd;
window.checkCombatEnd = function checkCombatEnd() {
  // Run original — but we intercept the loot section by monkey-patching
  // the inline forEach that ran ITEM_DB-less drops.
  // The easiest approach: just call original and let it run,
  // then also run our new loot system if victory was declared.
  return _origCheckCombatEnd?.();
};

// Override the old loot drop inside combat victory.
// We hook into the setTimeout callback that fires after victory.
// The simplest clean approach: override addToInventory to do nothing
// briefly, run original, then restore — but that's fragile.
// Instead, the cleanest fix is to update checkCombatEnd directly in index.html:
//
// FIND this block in checkCombatEnd:
//   // Loot from all enemies
//   combat.enemies.forEach(e=>{
//     if(Math.random()<.4&&e.def.loot?.length){
//       const lootName=e.def.loot[randInt(0,e.def.loot.length-1)];
//       addLog(`Found: ${lootName}!`,'loot');
//       addToInventory({name:lootName,icon:'📦',desc:'Item',price:randInt(5,30),type:'misc',effect:{},qty:1});
//     }
//   });
//
// REPLACE WITH:
//   grantCombatLoot(combat.enemies);
//
// That's the only manual edit needed in index.html for loot.

console.log('[Equipment System] ✅ Paperdoll, loot tables, and distance-scaled shops loaded.');
console.log('[Equipment System] Manual step: In checkCombatEnd, replace the loot forEach with: grantCombatLoot(combat.enemies)');
