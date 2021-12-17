import { WWKSettings } from "./wwk-settings.mjs";

/**
 * An object containing static data for the game system.
 * @type {WWKSettings}
 */
export const WWK = {};

/**
 * The name of the folder containing the system.
 * @type {string}
 */
WWK.systemFolder = "wwk";

/**
 * The set of Skills used within the system, and their translation key.
 * @type {Object}
 */
WWK.skills = {
  "acrobatie": "WWK.Skills.acrobatie",
  "athletisme": "WWK.Skills.athletisme",
  "autorite": "WWK.Skills.autorite",
  "combat-cac": "WWK.Skills.combat-cac",
  "combat-distance": "WWK.Skills.combat-distance",
  "connaissance": "WWK.Skills.connaissance",
  "defense": "WWK.Skills.defense",
  "discretion": "WWK.Skills.discretion",
  "documentation": "WWK.Skills.documentation",
  "eloquence": "WWK.Skills.eloquence",
  "equitation": "WWK.Skills.equitation",
  "intellect": "WWK.Skills.intellect",
  "langue": "WWK.Skills.langue",
  "muscles": "WWK.Skills.muscles",
  "pilotage": "WWK.Skills.pilotage",
  "perception": "WWK.Skills.perception",
  "psychologie": "WWK.Skills.psychologie",
  "reflexes": "WWK.Skills.reflexes",
  "resistance": "WWK.Skills.resistance",
  "soins": "WWK.Skills.soins",
  "survie": "WWK.Skills.survie",
  "technique": "WWK.Skills.technique",
  "volonte": "WWK.Skills.volonte"
};

WWK.valueTypes = {
  NUMERICAL: "numerical",
  ROLL_EXPRESSION : "roll-expression",
}

const systemValues = [
  { id: "resources.hp.max", label: "Points de Vitalité (max)" },
  { id: "resources.wounds.max", label: "Blessures (max)" },
  { id: "damageBonus.melee", label: "Bonus aux Dégâts (Corps à corps)", type: WWK.valueTypes.ROLL_EXPRESSION },
  { id: "damageBonus.ranged", label: "Bonus aux Dégâts (Distance)", type: WWK.valueTypes.ROLL_EXPRESSION },
  { id: "skills.acrobatie", label: "Acrobatie" },
  { id: "skills.athletisme", label: "Athlétisme" },
  { id: "skills.autorite", label: "Autorité" },
  { id: "skills.combat-cac", label: "Combat (Corps à corps)" },
  { id: "skills.combat-distance", label: "Combat (Distance)" },
  { id: "skills.connaissance", label: "Connaissance" },
  { id: "skills.defense", label: "Défense" },
  { id: "skills.discretion", label: "Discrétion" },
  { id: "skills.documentation", label: "Documentation" },
  { id: "skills.eloquence", label: "Eloquence" },
  { id: "skills.equitation", label: "Equitation" },
  { id: "skills.intellect", label: "Intellect" },
  { id: "skills.langue", label: "Langue" },
  { id: "skills.muscles", label: "Muscles" },
  { id: "skills.perception", label: "Perception" },
  { id: "skills.pilotage", label: "Pilotage" },
  { id: "skills.psychologie", label: "Psychologie" },
  { id: "skills.reflexes", label: "Réflexes" },
  { id: "skills.resistance", label: "Résistance" },
  { id: "skills.soins", label: "Soins" },
  { id: "skills.survie", label: "Survie" },
  { id: "skills.technique", label: "Technique" },
  { id: "skills.volonte", label: "Volonté" },
];

WWK.values = new Map();
for (const v of systemValues) {
  WWK.values.set(v.id, v);
}