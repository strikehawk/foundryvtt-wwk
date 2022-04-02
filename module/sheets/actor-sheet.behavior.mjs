import { WWK } from "../helpers/config.mjs";
import { WwkActor } from "../documents/actor.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

export class ActorSheetBehaviorBase {

    static patchOptions(options) {

    }

    /**
     * The sheet this behavior is attached to.
     * @type {WwkActorSheet} 
     *
     * @readonly
     * @memberof ActorSheetBehaviorBase
     */
     get sheet() {
        return this._sheet;
    }
    
    /**
     * The actor displayed in the sheet.
     * @type {WwkActor}
     *
     * @readonly
     * @memberof ActorSheetBehaviorBase
     */
     get actor() {
        return this._actor;
    }

    /**
     * The path to the template of the actor sheet.
     * @type {string}
     *
     * @readonly
     * @memberof ActorSheetBehaviorBase
     */
    get template() {
        const path = `systems/${wwkGlobal.systemFolder}/templates/actor`;
        // Return a single sheet for all item types.
        // return `${path}/item-sheet.html`;

        // Alternatively, you could use the following return statement to do a
        // unique item sheet by type, like `weapon-sheet.html`.
        return `${path}/actor-${this.actor.data.type}-sheet.html`;
    }

    constructor(sheet, actor) {
        this._sheet = sheet;
        this._actor = actor;
    }

    activateListeners(html) {
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // Roll handlers, click handlers, etc. would go here.
    }

    patchContext(context) {
        
    }

    _updateObject(event, formData) {
    }

    /** @inheritdoc */
    _onDragOver(event) {
    }

    /** @inheritdoc */
    _onDrop(event) {
    }
}