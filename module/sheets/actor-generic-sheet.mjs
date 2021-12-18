import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class WwkGenericActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["wwk", "sheet", "actor"],
      template: `systems/${wwkGlobal.systemFolder}/templates/actor/actor-generic-sheet.html`,
      width: 800,
      height: 650,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/${wwkGlobal.systemFolder}/templates/actor/actor-generic-sheet.html`;
  }
}