import { WWK } from "../helpers/config.mjs";
import { WWKSettings } from "../helpers/wwk-settings.mjs";

/** @type {WWKSettings} */
const wwkGlobal = WWK;

export const setupActorSkillFormListeners = function (html, sheet) {
    html.find('.skill-edit').click(onSkillEdit.bind(sheet));
};

function onSkillEdit(event) {
    event.preventDefault();

    const li = $(event.currentTarget).parents(".skill");
    const skillId = li.data("itemId");

    const skills = this.actor.data.data.skills;
    let skill;
    let found = false;
    for (const key in skills) {
        skill = skills[key];

        if (skill.uuid === skillId) {
            displayActorSkillForm(event, skill, this);
            found = true;
            break;
        }
    }

    if (!found) {
        console.warn(`Skill '${skillId}' not found`);
    }
}

function displayActorSkillForm(event, skill, sheet) {
    const options = {
        left: event.pageX,
        top: event.pageY,
    };

    const vm = { skill, sheet };
    new ActorSkillFormApplication(vm, options).render(true);
};

/**
 * An editing form for an actor skill.
 */
class ActorSkillFormApplication extends FormApplication {
    constructor(vm, options) {
        super(vm.skill, options);
        this.vm = vm;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 400,
            classes: ["wwk", "sheet", "form"],
            popOut: true,
            template: `systems/${wwkGlobal.systemFolder}/templates/actor/parts/actor-skill-form.html`,
            id: 'actor-skill-form-application',
            title: 'Skill screen',
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