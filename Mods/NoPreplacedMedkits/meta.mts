import { ESpawnType, Struct } from "s2cfgtojson";

type StructType = Struct<{
  SpawnType: ESpawnType;
  ItemSID?: string;
  PackOfItemsPrototypeSID?: string;
  SID: string;
  SpawnOnStart: boolean;
}>;

const items = ["Medkit"];
const spawnTypes = ["ESpawnType::Item", "ESpawnType::PackOfItems"];
export const meta = {
  interestingFiles: ["WorldMap_WP"],
  interestingContents: ["ESpawnType::Item", "ESpawnType::PackOfItems", ...items],
  prohibitedIds: [],
  interestingIds: [],
  description: `This mode does only one thing: removes all 650+ medkits placed around the map for more challenging gameplay.[h1][/h1]
[hr][/hr]
😤 Tired of those cute little medkits scattered around the map like breadcrumbs for weaklings?[h1][/h1]
💀 This mod is for players who want to feel the sting of death without any pre-placed safety nets.[h1][/h1]
🕸️ Increased tension. Every bullet, tripwire, and mutant encounter feels like a 10/10 horror movie.[h1][/h1]
⚰️ Achievement unlocked: “I DIED 47 TIMES BEFORE REACHING ZALISSYA.”[h1][/h1]
[hr][/hr]
It is meant to be used in other collections of mods. Does not conflict with anything.
[hr][/hr]
Thanks @rbwadle for suggesting how to modify map objects.`,
  changenote: "Update for 1.6",
  entriesTransformer: (entries: StructType["entries"]) => {
    if (items.some((i) => entries.ItemSID?.includes(i) || entries.PackOfItemsPrototypeSID?.includes(i)) && spawnTypes.some((s) => entries.SpawnType === s)) {
      console.info(`Found preplaced item: ${entries.ItemSID || entries.PackOfItemsPrototypeSID}. Hiding it.`);
      entries.SpawnOnStart = false;
      return entries;
    }
    return null;
  },
};
