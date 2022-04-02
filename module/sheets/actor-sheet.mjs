import { ActorSheetBehaviorBase } from "./actor-sheet.behavior.mjs";
import { ActorSheetHeroBehavior } from "./actor-sheet-hero.behavior.mjs";
import { ActorSheetBasicNpcBehavior } from "./actor-sheet-basic-npc.behavior.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class WwkActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    const options = mergeObject(super.defaultOptions, {
      classes: ["wwk", "sheet", "actor"],
      width: 520,
      height: 500,
    });

    return options;
  }

  /**
   * Get the appropriate ActorSheetBehavior based on the Actor type.
   * 
   * @param {Object} actor 
   */
  static _getBehavior(actor) {
    if (!actor) {
      return ActorSheetBehaviorBase;
    }

    switch (actor.type) {
      case "hero":
        return ActorSheetHeroBehavior;
      case "basic-npc":
        return ActorSheetBasicNpcBehavior
      default:
        return ActorSheetBehaviorBase;
    }
  }

  /** @override */
  get template() {
    return this._behavior.template;
  }

  constructor(actor, options) {
    const behaviorClass = WwkActorSheet._getBehavior(actor);
    behaviorClass.patchOptions(options);

    super(actor, options);
    this._behavior = new behaviorClass(this, actor);
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.actor.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = actorData.data;
    context.flags = actorData.flags;

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    this._behavior.patchContext(context);

    return context;
  }
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Drag events for macros.
    if (this.actor.owner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }

    this._behavior.activateListeners(html);
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  async _updateObject(event, formData) {
    this._behavior._updateObject(event, formData);

    super._updateObject(event, formData);
  }
}
