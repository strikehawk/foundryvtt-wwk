import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

import { ItemSheetBehaviorBase } from "./item-sheet.behavior.mjs";

export class ItemSheetProfileBehavior extends ItemSheetBehaviorBase {

    static patchOptions(options) {
        options.width = 600;
        options.height = 560;
        options.closeOnSubmit = false;
        options.submitOnClose = true;
        options.submitOnChange = true;
    }

    static patchItem(item) {
        // Ensure 'boostedSkills' is an array
        let boostedSkills = item.data.boostedSkills;
        if (!Array.isArray(boostedSkills)) {
            boostedSkills = [boostedSkills];
            item.data.boostedSkills = boostedSkills;
        }

        // Build 'boostedSkills' concatenated string
        const labels = [];
        for (const skill of boostedSkills) {
            labels.push(game.i18n.localize(wwkGlobal.skills[skill]) ?? skill)
        }
        item.data.boostedSkillsLabels = labels.join(", ");

        // Insert value label in bonus
        let systemValue;
        for (const feature of Object.values(item.data.features)) {
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

    constructor(sheet, item) {
        super(sheet, item);
    }

    patchContext(context) {
        ItemSheetProfileBehavior.patchItem(context);
    }
}