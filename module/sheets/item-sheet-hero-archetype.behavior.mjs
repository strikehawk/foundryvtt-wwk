import { ItemSheetBehaviorBase } from "./item-sheet.behavior.mjs";
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

    patchContext(context) {
        // Handle skills.
        for (let [k, v] of Object.entries(context.data.skills)) {
            v.label = game.i18n.localize(CONFIG.WWK.skills[k]) ?? k;
            v.uuid = getSkillIdentifier(k, v);

            // Calculate the final value of the skill
            v.value = v.baseValue + (v.augmented ? 2 : 0) + v.modifier;
        }

        // Handle talents
        const talentItems = [];
        let talentId;
        for (const id of Object.keys(context.data.talents)) {
            talentId = context.data.talents[id];
            talentItems.push(this.talents.get(talentId));
        }
        context.data.talentItems = talentItems;
    }

    _updateObject(event, formData) {
        // Transform talents property
        let talents = [];
        for (const key of Object.keys(formData)) {
            if (key.startsWith("data.talents.")) {
                let index = key.replace("data.talents.", "");
                talents[index] = formData[key];
            }
        }

        formData["data.talents"] = talents;

        super._updateObject(event, formData);
    }

    /** @inheritdoc */
    _onDragOver(event) {
        // Try to extract the data
        const item = this._parseDataTransferItem(event.dataTransfer);

        // if (!item || item.data.type !== "talent") {
        //     event.dataTransfer.dropEffect = "none";
        // } else {
        //     event.dataTransfer.dropEffect = "link";
        // }
    }

    /** @inheritdoc */
    _onDrop(event) {
        // Try to extract the data
        const item = this._parseDataTransferItem(event.dataTransfer);

        if (!item || item.data.type !== "talent") {
            return;
        }

        if (event.target.classList.contains("droppable")) {
            event.target.value = item.data.data["talent-id"];
        }
    }

    _parseDataTransfer(dataTransfer) {
        // Try to extract the data
        let data;
        try {
            data = JSON.parse(dataTransfer.getData('text/plain'));
        } catch (err) {
            return false;
        }

        return data;
    }

    _parseDataTransferItem(dataTransfer) {
        const data = this._parseDataTransfer(dataTransfer);

        if (!data || data.type !== "Item") {
            return null;
        }

        const item = game.collections.get("Item").get(data.id);

        return item;
    }
}