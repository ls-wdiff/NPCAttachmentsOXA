import { Meta } from "../../helpers/meta.mjs";
import { DynamicItemGenerator, ERank, Struct } from "s2cfgtojson";
import { transformArmor } from "./transformArmor.mjs";

/**
 * Does not allow traders to sell gear.
 * Allows NPCs to drop armor.
 */
export const transformDynamicItemGenerator: Meta<DynamicItemGenerator>["entriesTransformer"] = (struct) => {
  if (struct.SID.includes("Trade")) {
    return;
  }

  const fork = struct.fork();

  const categories = struct.ItemGenerator.entries().map(([_k, ig]) => ig.Category);
  categories.forEach((Category) => {
    const generators = struct.ItemGenerator.entries().filter(([_k, ig]) => ig.Category === Category);
    const genRanks = new Set(generators.flatMap(([_k, ig]) => (ig.PlayerRank ? ig.PlayerRank.split(",").map((r) => r.trim()) : [])));
    const missingRanks = allRanks.difference(genRanks);
    if (generators.length) {
      [...missingRanks].forEach((mr) => {
        struct.ItemGenerator.addNode(
          new Struct({
            Category,
            PlayerRank: mr,
            bAllowSameCategoryGeneration: true,
            PossibleItems: new Struct({
              __internal__: { rawName: "PossibleItems", isArray: true },
            }),
          }),
          `${Category.replace("EItemGenerationCategory::", "")}_for_${mr.replace("ERank::", "_")}`,
        );
      });
    }
  });

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

  return Object.assign(fork, { ItemGenerator });
};
const allRanks = new Set<ERank>(["ERank::Newbie", "ERank::Experienced", "ERank::Veteran", "ERank::Master"]);
