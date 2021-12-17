import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

import { ItemSheetBehaviorBase } from "./item-sheet.behavior.mjs";
import { ItemProfileFeatureFormApplication } from "./item-profile-feature.form.mjs";

export class ItemSheetProfileBehavior extends ItemSheetBehaviorBase {

    static patchOptions(options) {
        options.width = 900;
        options.closeOnSubmit = false;
        options.submitOnClose = true;
        options.submitOnChange = true;
    }

    constructor(sheet, item) {
        super(sheet, item);
    }


    patchContext(context) {
        // Ensure 'boostedSkills' is an array
        let boostedSkills = context.data.boostedSkills;
        if (!Array.isArray(boostedSkills)) {
            boostedSkills = [boostedSkills];
            context.data.boostedSkills = boostedSkills;
        }

        // Insert value label in bonus
        let systemValue;
        for (const feature of Object.values(context.data.features)) {
            if (Array.isArray(feature.bonus)) {
                if (feature.bonus.length === 0) {
                    feature.bonus = undefined;
                } else { 
                    for (const bonus of feature.bonus) {
                        systemValue = WWK.values.get(bonus.valueId);
                        bonus.valueLabel = systemValue && systemValue.label;
                    }
                }
            }
        }
    }

    /** @override */
    activateListeners(html) {
        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.sheet.isEditable) return;

        html.find('.skill-add').click(ev => {
            ev.preventDefault();

            const item = this.item;
            let boostedSkills = item.data.data.boostedSkills;
            if (!Array.isArray(boostedSkills)) {
                boostedSkills = [boostedSkills];
                item.data.data.boostedSkills = boostedSkills;
            }
            boostedSkills.push("Nouvelle compétence");

            // TODO trigger _updateObject
            this.sheet.render(true);
        });

        html.find('.skill-remove').click(ev => {
            ev.preventDefault();

            const div = $(ev.currentTarget).parents(".boosted-skill");
            const idx = div.data("index");

            const item = this.item;
            let boostedSkills = item.data.data.boostedSkills;
            if (!Array.isArray(boostedSkills)) {
                boostedSkills = [boostedSkills];
                item.data.data.boostedSkills = boostedSkills;
            }
            boostedSkills.splice(idx, 1);

            // TODO trigger _updateObject
            this.sheet.render(true);
        });

        html.find('.feature-add').click(ev => {
            ev.preventDefault();

            const item = this.item;
            let features = item.data.data.features;

            const nextIdx = Object.keys(features).length;
            features[nextIdx] = {
                id: "ID nouveau trait",
                description: "Nouveau trait"
            };

            // TODO trigger _updateObject
            this.sheet.render(true);
        });

        html.find('.feature-edit').click(ev => {
            ev.preventDefault();

            const div = $(ev.currentTarget).parents(".feature");
            const index = div.data("index");

            const item = this.item;
            const features = item.data.data.features;
            const feature = features[index];
            const options = {
                left: ev.pageX,
                top: ev.pageY,
            };

            const vm = { feature, sheet: this.sheet };
            new ItemProfileFeatureFormApplication(vm, options).render(true);
        });

        html.find('.feature-remove').click(ev => {
            ev.preventDefault();

            const div = $(ev.currentTarget).parents(".feature");
            const idx = div.data("index");

            const item = this.item;
            let features = item.data.data.features;
            delete features[idx];

            // TODO trigger _updateObject
            this.sheet.render(true);
        });
    }
}