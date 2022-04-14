import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

import { ItemBehaviorBase } from "./item.behavior.mjs";
import { getSkillIdentifier } from "../helpers/templates.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

export class ItemArchetypeBehavior extends ItemBehaviorBase {
    prepareDerivedData(itemData) {
        if (itemData.data.skills) {
            // Handle skills.
            for (let [k, v] of Object.entries(itemData.data.skills)) {
                v.label = game.i18n.localize(CONFIG.WWK.skills[k]) ?? k;
                v.uuid = getSkillIdentifier(k, v);

                // Calculate the final value of the skill
                v.value = v.baseValue + (v.augmented ? 2 : 0) + v.modifier;
            }
        }

        if (itemData.data.boostedSkills) {
            // Ensure 'boostedSkills' is an array
            let boostedSkills = itemData.data.boostedSkills;
            if (!Array.isArray(boostedSkills)) {
                boostedSkills = [boostedSkills];
                itemData.data.boostedSkills = boostedSkills;
            }

            // Build 'boostedSkills' concatenated string
            const labels = [];
            for (const skill of boostedSkills) {
                labels.push(game.i18n.localize(wwkGlobal.skills[skill]) ?? skill)
            }
            itemData.data.boostedSkillsLabels = labels.join(", ");
        }

        if (itemData.data.features) {
            // Insert value label in bonus
            let systemValue;
            for (const feature of Object.values(itemData.data.features)) {
                if (Array.isArray(feature.bonus)) {
                    if (feature.bonus.length === 0) {
                        feature.bonus = undefined;
                    } else {
                        for (const bonus of feature.bonus) {
                            systemValue = wwkGlobal.values.get(bonus.valueId);
                            bonus.valueLabel = systemValue && systemValue.label;
                        }
                    }
                }
            }
        }
    }
}