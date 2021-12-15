import { ItemSheetBehaviorBase } from "./item-sheet.behavior.mjs";
import { ArchetypeTalentFormApplication } from "./item-talent.form.mjs";
import { getSkillIdentifier } from "../helpers/templates.mjs";

export class ItemSheetHeroArchetypeBehavior extends ItemSheetBehaviorBase {

    static patchOptions(options) {
        options.width = 900;
        options.closeOnSubmit = false;
        options.submitOnClose = true;
        options.submitOnChange = true;
    }

    static _getTalentMap() {
        const talents = new Map();

        for (const item of game.collections.get("Item").values()) {
            if (item.type !== "talent") {
                continue;
            }

            talents.set(item.data.data["talent-id"], item);
        }

        return talents;
    }

    constructor(sheet, item) {
        super(sheet, item);

        this.talents = ItemSheetHeroArchetypeBehavior._getTalentMap();
    }

    activateListeners(html) {
        html.find('.talent-edit').click(this._onTalentEdit.bind(this));
    }

    patchContext(context) {
        // Handle skills.
        for (let [k, v] of Object.entries(context.data.skills)) {
            v.label = game.i18n.localize(CONFIG.WWK.skills[k]) ?? k;
            v.uuid = getSkillIdentifier(k, v);

            // Calculate the final value of the skill
            v.value = v.baseValue + (v.augmented ? 2 : 0) + v.modifier;
        }
    }

    // _updateObject(event, formData) {
    //     const talents = this.sheet.object.data.data.talents;

    //     let talent;
    //     for (let i = 0; i < talents.length; i++) {
    //         talent = talents[i];
    //         formData[`data.talents.${i}.name`] = talent.name;
    //         formData[`data.talents.${i}.normalEffect`] = talent.normalEffect;
    //         formData[`data.talents.${i}.heroicEffect`] = talent.heroicEffect;
    //     }
    // }
    
    _onTalentEdit(event) {
        event.preventDefault();
    
        const li = $(event.currentTarget).parents(".talent");
        const index = li.data("index");
        const talent = this.item.data.data.talents[index];

        if (!talent) {
            console.warn(`No talent found`);
        }

        this._displayTalentForm(event, talent);
    }

    _displayTalentForm(event, talent) {
        const options = {
            left: event.pageX,
            top: event.pageY,
        };
    
        const vm = { talent, sheet: this.sheet };
        new ArchetypeTalentFormApplication(vm, options).render(true);
    }
}