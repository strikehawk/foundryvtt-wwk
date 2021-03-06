import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

import { ActorBehaviorBase } from "./actor.behavior.mjs";
import { ItemBehaviorSelector } from "./item-behavior-selector.mjs";
import { getSkillIdentifier } from "../helpers/templates.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

export class ActorHeroBehavior extends ActorBehaviorBase {
    /**
     * Augment the basic actor data with additional dynamic data. Typically,
     * you'll want to handle most of your calculated/derived data in this step.
     * Data calculated in this step should generally not exist in template.json
     * (such as ability modifiers rather than ability scores) and should be
     * available both inside and outside of character sheets (such as if an actor
     * is queried and has a roll executed directly from it).
     * @param {WwkActor} actor 
     */
    prepareDerivedData(actor) {
        const actorData = actor.data;
        this._prepareItems(actorData, actor);
        this._prepareCharacterData(actorData);
        this._computeModifiers(actorData);
    }

    /**
     * @param {Object} data
     */
    patchRollData(data) {
        this._patchRollData(data);
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareItems(context, actor) {
        // Initialize containers.
        const gear = [];
        let archetype;
        let profile;

        // Iterate through items, allocating to containers
        for (let i of context.items) {
            // i.img = i.img || DEFAULT_TOKEN;
            // Append to gear.
            if (i.type === "item") {
                gear.push(i);
            }
            // Set archetype.
            else if (i.type === "hero-archetype") {
                archetype = i.data;
            }
            // Set profile.
            else if (i.type === 'profile') {
                profile = i.data;
            }
        }

        // Assign and return
        context.gear = gear;
        context.archetype = archetype;
        context.profile = profile;

        // if (profile) {
        //     const behavior = ItemBehaviorSelector.getBehavior(profile);
        //     behavior.prepareDerivedData(profile);
        //     // ItemSheetProfileBehavior.patchItem(context.profile);
        // }
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

        // Handle damage bonus
        context.data.damageBonus.melee.baseValue = archetype.data.damageBonus.melee;
        modifiableValues.set("damageBonus.melee", context.data.damageBonus.melee);
        context.data.damageBonus.ranged.baseValue = archetype.data.damageBonus.ranged;
        modifiableValues.set("damageBonus.ranged", context.data.damageBonus.ranged);

        // Handle talents
        if (!context.data.talents) {
            context.data.talents = foundry.utils.deepClone(archetype.data.talents);
        }
        const currentTalents = context.data.talents;
        Object.assign(currentTalents[0], archetype.data.talents[0]);
        Object.assign(currentTalents[1], archetype.data.talents[1]);

        // Handle skills.
        const currentSkills = context.data.skills;
        const newSkills = {};

        let skill;
        let currentSkill;
        let skillId;
        for (let [k, v] of Object.entries(archetype.data.skills)) {
            currentSkill = currentSkills[k] ? foundry.utils.deepClone(currentSkills[k]) : {};

            skillId = `skills.${k}`;

            skill = foundry.utils.deepClone(v);
            skill.id = skillId;
            skill.label = game.i18n.localize(wwkGlobal.skills[k]) ?? k;
            skill.uuid = getSkillIdentifier(k, skill);

            skill = Object.assign(currentSkill, skill);
            newSkills[k] = skill;

            modifiableValues.set(skillId, skill);
        }

        context.data.skills = newSkills;

        // Apply Profile modifiers
        this._applyProfile(context, modifiableValues)
    }

    _applyProfile(context, modifiableValues) {
        if (context.profile) {
            let modifiableValue;

            const boostedSkills = new Set(context.profile.data.boostedSkills);

            // Handle skills.
            let skillModifier;
            let valueId;
            let bonus;

            for (let [k, v] of Object.entries(context.data.skills)) {
                skillModifier = boostedSkills.has(k) ? context.profile.data.boostedSkillBonus : context.profile.data.generalSkillBonus;
                valueId = `skills.${k}`;
                modifiableValue = modifiableValues.get(valueId);
                modifiableValue.modifiers = [];

                bonus = { valueId, modifier: skillModifier };
                modifiableValue.modifiers.push(bonus);
            }

            for (const feature of Object.values(context.profile.data.features)) {
                if (Array.isArray(feature.bonus)) {
                    for (const bonus of feature.bonus) {
                        if (!bonus.valueId) {
                            console.error(`No valueId for bonus`);
                            continue;
                        }

                        // Get the value
                        modifiableValue = modifiableValues.get(bonus.valueId);
                        modifiableValue.modifiers = [];

                        modifiableValue.modifiers.push(bonus);
                    }
                }
            }
        }
    }

    _computeModifiers(context) {
        // Handle resources.
        this._processModifiableValue(context.data.resources.hp.max);
        this._processModifiableValue(context.data.resources.wounds.max);

        // Handle damage bonus.
        this._processModifiableValue(context.data.damageBonus.melee);
        this._processModifiableValue(context.data.damageBonus.ranged);

        // Handle skills.
        for (let [k, v] of Object.entries(context.data.skills)) {
            this._processModifiableValue(v);
        }
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
     * Prepare character roll data.
     */
    _patchRollData(data) {
        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@str.mod + 4`.
        if (data.skills) {
            for (let [k, v] of Object.entries(data.skills)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }
    }
}