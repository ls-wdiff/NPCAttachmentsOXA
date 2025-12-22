import { WeaponPrototype } from "s2cfgtojson";
import { EntriesTransformer } from "../../src/metaType.mts";
import { getTemplate } from "../../src/backfillDef.mts";
import { allDefaultWeaponPrototypesRecord } from "../../src/consts.mts";

/**
 * Remove an essential flag from various items
 * And allow smgs to go into a pistol slot
 */
export const transformWeaponPrototypes: EntriesTransformer<WeaponPrototype> = async (struct) => {
  const fork = struct.fork();

  if (getTemplate(struct, allDefaultWeaponPrototypesRecord) === "TemplateSMG") {
    fork.ItemSlotType = "EInventoryEquipmentSlot::Pistol";
  }
  if (struct.IsQuestItem) {
    fork.IsQuestItem = false;
  }
  if (fork.entries().length) {
    return fork;
  }
};
transformWeaponPrototypes.files = ["/WeaponPrototypes.cfg"];
