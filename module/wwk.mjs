// Import document classes.
import { WwkActor } from "./documents/actor.mjs";
import { WwkItem } from "./documents/item.mjs";
// Import sheet classes.
import { WwkActorSheet } from "./sheets/actor-sheet.mjs";
import { WwkItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates, addHandlebarsHelpers } from "./helpers/templates.mjs";

import { WWK } from "./helpers/config.mjs";
import { WWKSettings } from "./helpers/wwk-settings.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.wwk = {
    WwkActor,
    WwkItem
  };

  // Add custom constants for configuration.
  /** @type {WWKSettings} */
  CONFIG.WWK = wwkGlobal;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = WwkActor;
  CONFIG.Item.documentClass = WwkItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("wwk", WwkActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("wwk", WwkItemSheet, { makeDefault: true });

  // Add custom Handlebars formatter
  addHandlebarsHelpers();

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});