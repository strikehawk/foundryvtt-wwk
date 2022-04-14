import { ActorBehaviorBase } from "./actor.behavior.mjs";
import { ActorHeroBehavior } from "./actor-hero.behavior.mjs";

export class ActorBehaviorSelector {
    /**
     * Get the appropriate ActorBehavior based on the Actor type.
     * 
     * @param {Object} actor 
     */
    static getBehavior(actor) {
        if (!actor) {
            return new ActorBehaviorBase();
        }

        switch (actor.type) {
            case "hero":
                return new ActorHeroBehavior();
            default:
                return new ActorBehaviorBase();
        }
    }
}