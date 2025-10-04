import { ArmorPrototype, createDynamicClassInstance } from "s2cfgtojson";
import { calculateArmorScore } from "./calculateArmorScore.mjs";
import { allExtraArmors, newArmors } from "./armors.util.mjs";
import { backfillArmorDef } from "./backfillArmorDef.mjs";
import { allDefaultArmorDefs } from "./allDefaultArmorDefs.mjs";

export const allArmorRank = Object.fromEntries(
  Object.values({
    ...allDefaultArmorDefs,
    ...Object.fromEntries(
      allExtraArmors.map((e) => {
        const SID = e.SID;
        const refkey = e.__internal__.refkey;
        const dummy = createDynamicClassInstance(SID) as ArmorPrototype;
        dummy.SID = SID;
        dummy.__internal__.refkey = refkey;

        return [SID, dummy] as [string, ArmorPrototype];
      }),
    ),
    ...newArmors,
  })
    .filter((armor) => !armor.SID.includes("Template"))
    .map((armor) => {
      const backfilled = backfillArmorDef(JSON.parse(JSON.stringify(armor))) as ArmorPrototype;
      return [armor.SID, calculateArmorScore(backfilled)] as [string, number];
    })
    .sort((a, b) => a[0].localeCompare(b[0])),
);
