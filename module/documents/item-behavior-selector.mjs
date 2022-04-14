import { ItemBehaviorBase } from "./item.behavior.mjs";
import { ItemArchetypeBehavior } from "./item-archetype.behavior.mjs";
import { ItemProfileBehavior } from "./item-profile.behavior.mjs";

export class ItemBehaviorSelector {
    static getBehavior(item) {
        if (!item) {
            return new ItemBehaviorBase();
          }
      
          switch (item.type) {
            case "hero-archetype":
              return new ItemArchetypeBehavior();
            case "profile":
              return new ItemProfileBehavior();
            default:
              return new ItemBehaviorBase();
          }
    }
}