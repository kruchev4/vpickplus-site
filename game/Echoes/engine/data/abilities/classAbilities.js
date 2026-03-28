export const CLASS_ABILITIES = {
  fighter: [
    {
      id: "war_cry",
      name: "War Cry",
      icon: "📯",
      tag: "new",
      desc:
        "Once per combat, shout a war cry — grants +3 ATK and +2 DMG for 2 rounds.",
      effect: { type: "combat_buff", atk: 3, dmg: 2, rounds: 2, once: true },
      levels: [3],
    },
    {
      id: "iron_will",
      name: "Iron Will",
      icon: "🛡️",
      tag: "passive",
      desc:
        "Passive: reduce all incoming damage by 2. Your resolve turns blows aside.",
      effect: { type: "passive", dmgReduce: 2 },
      levels: [3, 5],
    },
    // …(rest unchanged)
  ],

  wizard: [
    {
      id: "arcane_focus",
      name: "Arcane Focus",
      icon: "🔮",
      tag: "passive",
      desc:
        "Passive: all spell damage +3. Your mastery sharpens every casting.",
      effect: { type: "passive", spellDmg: 3 },
      levels: [3],
    },
    // …
  ],

  // continue copying each class unchanged
};
