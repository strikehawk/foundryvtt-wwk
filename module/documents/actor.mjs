/** @typedef {import("@league-of-foundry-developers/foundry-vtt-types")} */

import { ActorBehaviorSelector } from "./actor-behavior-selector.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class WwkActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    const behavior = ActorBehaviorSelector.getBehavior(this);
    if (behavior && behavior.prepareDerivedData) {
      behavior.prepareDerivedData(this);
    }
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    const behavior = ActorBehaviorSelector.getBehavior(this);
    if (behavior && behavior.patchRollData) {
      behavior.patchRollData(data);
    }

    return data;
  }
}