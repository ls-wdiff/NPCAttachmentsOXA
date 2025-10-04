import { Meta } from "../../helpers/meta.mjs";
import { ArmorPrototype, Struct } from "s2cfgtojson";
import { allDefaultArmorDefs, allExtraArmors, backfillArmorDef, newArmors } from "./armors.util.mjs";
import { deepMerge } from "../../helpers/deepMerge.mjs";
import { undroppableArmors } from "./undroppableArmors.mjs";
import { get } from "./get.mjs";

/**
 * Adds armor that doesn't block head, but also removes any psy protection. Allows player to use helmets.
 */
export const transformArmorPrototypes: Meta<ArmorPrototype>["entriesTransformer"] = (struct, context) => {
  if (undroppableArmors.has(struct.SID)) {
    return null;
  }

  if (!oncePerFile.has(context.filePath)) {
    oncePerFile.add(context.filePath);
    allExtraArmors.forEach((descriptor) => {
      const original = descriptor.__internal__.refkey;
      const newSID = descriptor.SID;
      if (!context.structsById[original]) {
        return;
      }
      const armor = allDefaultArmorDefs[original];
      if (!armor) {
        return;
      }

      const newArmor = new Struct({
        SID: newSID,
        __internal__: { rawName: newSID, refkey: original, refurl: struct.__internal__.refurl },
      }) as ArmorPrototype;
      backfillArmorDef(newArmor);
      const overrides = { ...newArmors[newSID as keyof typeof newArmors] };
      if (overrides.__internal__?._extras && "keysForRemoval" in overrides.__internal__._extras) {
        Object.entries(overrides.__internal__._extras.keysForRemoval).forEach(([p, v]) => {
          const e = get(newArmor, p) || {};
          const keyToDelete = Object.keys(e).find((k) => e[k] === v) || v;
          delete e[keyToDelete];
        });
        delete overrides.__internal__._extras;
      }
      deepMerge(newArmor, overrides);
      if (!newArmors[newSID]) {
        newArmor.Invisible = true;
      }
      context.extraStructs.push(newArmor.clone());
    });
  }

  return null;
};
const oncePerFile = new Set<string>();
