import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

/**
 * An editing form for an archetype talent.
 */
export class ItemProfileFeatureFormApplication extends FormApplication {
    constructor(vm, options) {
        super(vm.feature, options);
        this.vm = vm;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 500,
            height: 550,
            classes: ["wwk", "sheet", "form"],
            popOut: true,
            template: `systems/${wwkGlobal.systemFolder}/templates/item/item-profile-feature-sheet.html`,
            id: 'item-profile-feature-form-application',
            title: 'Profile feature screen',
            closeOnSubmit: false,
            submitOnClose: true,
            submitOnChange: true,
        });
    }

    getData() {
        // Send data to the template
        const data = super.getData();
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

    async _updateObject(event, formData) {
        Object.assign(this.object, formData);

        this.vm.sheet.render();
    }
}