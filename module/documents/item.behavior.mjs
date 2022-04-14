/** @typedef {import("@league-of-foundry-developers/foundry-vtt-types")} */

export class ItemBehaviorBase {
    /**
     * Augment the basic item data with additional dynamic data. Typically,
     * you'll want to handle most of your calculated/derived data in this step.
     * Data calculated in this step should generally not exist in template.json
     * (such as ability modifiers rather than ability scores) and should be
     * available both inside and outside of item sheets (such as if an item
     * is queried and has a roll executed directly from it).
     * @param {ItemData} itemData 
     */
    prepareDerivedData(itemData) {}
}