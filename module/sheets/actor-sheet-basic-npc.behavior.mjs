import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

import { ActorSheetBehaviorBase } from "./actor-sheet.behavior.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

export class ActorSheetBasicNpcBehavior extends ActorSheetBehaviorBase {

    static patchOptions(options) {
        options.width = 800;
        options.height = 650;
        options.closeOnSubmit = false;
        options.submitOnClose = true;
        options.submitOnChange = true;
    }

    constructor(sheet, actor) {
        super(sheet, actor);
    }

    activateListeners(html) {
        // Rollable abilities.
        html.find('.rollable').click(this._onRoll.bind(this));
    }

    patchContext(context) {
        this._prepareCharacterData(context);
        this._computeModifiers(context);
    }
    
    /**
     * Parse & prepare Character data.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
     _prepareCharacterData(context) {
        context.data.viewMode = true;

        if (!context.archetype) {
            return;
        }

        const archetype = context.archetype;

        const modifiableValues = new Map();

        // Handle resources.
        context.data.resources.hp.max.baseValue = archetype.data.resources.hp;
        modifiableValues.set("resources.hp.max", context.data.resources.hp.max);
        context.data.resources.wounds.max.baseValue = archetype.data.resources.wounds;
        modifiableValues.set("resources.wounds.max", context.data.resources.wounds.max);

        // Handle attacks.
        const currentAttacks = context.data.attacks;
        const newAttacks = {};

        let attacks;
        let currentAttack;
        let skillId;
        for (let [k, v] of Object.entries(archetype.data.skills)) {
            currentAttack = currentAttacks[k] ? foundry.utils.deepClone(currentAttacks[k]) : {};

            skillId = `attacks.${k}`;

            attacks = foundry.utils.deepClone(v);
            attacks.id = skillId;
            attacks.label = v.label;
            attacks.uuid = k;

            attacks = Object.assign(currentAttack, attacks);
            newAttacks[k] = attacks;
        }

        context.data.attacks = newAttacks;
    }

    _computeModifiers(context) {
        // Handle resources.
        this._processModifiableValue(context.data.resources.hp.max);
        this._processModifiableValue(context.data.resources.wounds.max);

        // // Handle skills.
        // for (let [k, v] of Object.entries(context.data.skills)) {
        //     this._processModifiableValue(v);
        // }
    }

    _processModifiableValue(v) {
        let sumModifiers;

        // Get the system value definition
        let systemValue = wwkGlobal.values.get(v.id);
        if (!systemValue) {
            console.error(v);
        }

        const valueType = systemValue.type === wwkGlobal.valueTypes.ROLL_EXPRESSION ? wwkGlobal.valueTypes.ROLL_EXPRESSION : wwkGlobal.valueTypes.NUMERICAL;

        // Compute sum of modifiers
        sumModifiers = valueType === wwkGlobal.valueTypes.ROLL_EXPRESSION ? "" : 0;
        if (v.modifiers) {
            for (const mod of v.modifiers) {
                sumModifiers += mod.modifier;
            }
        } else {
            v.modifiers = [];
        }
        v.modifier = sumModifiers;

        // Calculate the final value
        const baseValue = valueType === wwkGlobal.valueTypes.ROLL_EXPRESSION ? v.baseValue.toString() : v.baseValue;
        v.value = baseValue + v.modifier;
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
     async _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        // Handle item rolls.
        if (dataset.rollType) {
            if (dataset.rollType == 'item') {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.get(itemId);
                if (item) return item.roll();
            }
        }

        // Handle rolls that supply the formula directly.
        if (dataset.roll) {
            // attack roll
            if (dataset.rollType) {
                if (dataset.rollType === "attack") {
                    console.log(`${dataset.label}: dice ${dataset.damageDice}, bonus ${dataset.damageBonus}`);
                }
            }

            let label = dataset.label;
            let roll = await new Roll(dataset.roll, this.actor.getRollData()).evaluate({ async: true });
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
                rollMode: game.settings.get('core', 'rollMode'),
            });
            return roll;
        }
    }
}