import { Meta } from "../../helpers/meta.mjs";
import { DynamicItemGenerator, Struct } from "s2cfgtojson";
import { transformArmor } from "./transformArmor.mjs";
import { addMissingCategories } from "./addMissingCategories.mjs";

/**
 * Does not allow traders to sell gear.
 * Allows NPCs to drop armor.
 */
export const transformDynamicItemGenerator: Meta<DynamicItemGenerator>["entriesTransformer"] = (struct) => {
  if (struct.SID.includes("Trade")) {
    return;
  }

  addMissingCategories(struct);

  const ItemGenerator = struct.ItemGenerator.map(([_k, itemGenerator], i) => {
    // noinspection FallThroughInSwitchStatementJS
    switch (itemGenerator.Category) {
      case "EItemGenerationCategory::Head":
      case "EItemGenerationCategory::BodyArmor":
        return transformArmor(struct, itemGenerator as any, i);
    }
  });

  if (!ItemGenerator.entries().length || !ItemGenerator.filter((e): e is any => !!(e[1].PossibleItems as Struct).entries().length).entries().length) {
    return;
  }

  return Object.assign(struct.fork(), { ItemGenerator });
};
