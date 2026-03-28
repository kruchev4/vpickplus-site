export const CLASSES = [
  {
    id: "fighter", icon: "⚔️", name: "Fighter", role: "Warrior",
    hd: 10, pri: "STR", baseAC: 15, speed: 30, align: "Lawful Neutral",
    desc: "Master of martial combat, unrivalled on the battlefield.",
    actions: ["Attack", "Heavy Strike", "Defend", "Second Wind"],
    spells: []
  },
  {
    id: "wizard", icon: "📖", name: "Wizard", role: "Arcane",
    hd: 6, pri: "INT", baseAC: 12, speed: 30, align: "Neutral",
    desc: "Bends reality through arcane study and powerful spells.",
    actions: ["Attack", "Magic Missile", "Fireball", "Blink", "Meditate"],
    spells: ["Magic Missile", "Fireball", "Blink"]
  },
  {
    id: "rogue", icon: "🗡️", name: "Rogue", role: "Skirmisher",
    hd: 8, pri: "DEX", baseAC: 14, speed: 35, align: "Chaotic Neutral",
    desc: "Cunning trickster who strikes from the shadows.",
    actions: ["Attack", "Sneak Attack", "Dodge", "Poison Strike"],
    spells: []
  },
  {
    id: "cleric", icon: "✝️", name: "Cleric", role: "Divine",
    hd: 8, pri: "WIS", baseAC: 15, speed: 30, align: "Lawful Good",
    desc: "Channel divine power for healing and destruction.",
    actions: ["Attack", "Sacred Flame", "Heal", "Turn Undead", "Meditate"],
    spells: ["Sacred Flame", "Heal", "Turn Undead"]
  },
  // (continue copying the rest unchanged)
];
