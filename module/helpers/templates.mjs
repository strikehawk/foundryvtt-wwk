import { WWK } from "./config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";
import { HandlebarsHelpers } from "./handlebars-helpers.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

export const addHandlebarsHelpers = function () { 
  HandlebarsHelpers.registerHelpers();
}

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([

    // Actor partials.
    `systems/${wwkGlobal.systemFolder}/templates/actor/parts/actor-combat.html`,
    `systems/${wwkGlobal.systemFolder}/templates/actor/parts/actor-talents.html`,
    `systems/${wwkGlobal.systemFolder}/templates/actor/parts/actor-skills.html`,
    `systems/${wwkGlobal.systemFolder}/templates/actor/parts/actor-skill-form.html`,
    `systems/${wwkGlobal.systemFolder}/templates/actor/parts/actor-hero-sheet-full.html`,

    // Item partials
    `systems/${wwkGlobal.systemFolder}/templates/item/parts/item-profile-skills.html`,
    `systems/${wwkGlobal.systemFolder}/templates/item/parts/item-profile-features.html`,
  ]);
};

/**
 * Format the specializations (if any) of a skill as an identifier string.
 * @param {Object} skill The skill containing the potential specializations.
 * @return {string} 
 */
export function getSkillIdentifier(key, skill) {
  if (!key) return "";
  if (!skill) return "";

  if (!skill.specializations) {
    return key;
  }

  return key + "-" + skill.specializations;
}