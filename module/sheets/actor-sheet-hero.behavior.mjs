import { ActorSheetBehaviorBase } from "./actor-sheet.behavior.mjs";
import { setupActorSkillFormListeners } from "./actor-skill-form.mjs";

export class ActorSheetHeroBehavior extends ActorSheetBehaviorBase {

    static patchOptions(options) {
        options.width = 800;
        options.height = 650;
        options.tabs = [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }];
        options.closeOnSubmit = false;
        options.submitOnClose = true;
        options.submitOnChange = true;
    }

    constructor(sheet, actor) {
        super(sheet, actor);
    }

    activateListeners(html) {
        setupActorSkillFormListeners(html, this);

        html.find('.profile-remove').click(ev => {
            const index = $(ev.currentTarget).data("index");
            const item = this.actor.items.get(index);
            item.delete();

            this.render(false);
        });


        // Rollable abilities.
        html.find('.rollable').click(this._onRoll.bind(this));
    }

    patchContext(context) {
        const actor = context.actor;
        const actorData = actor.data;

        context.archetype = actorData.archetype;
        context.gear = actorData.skills;
        context.profile = actorData.profile;
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
            let label = dataset.label ? `[Compétence] ${dataset.label}` : '';
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