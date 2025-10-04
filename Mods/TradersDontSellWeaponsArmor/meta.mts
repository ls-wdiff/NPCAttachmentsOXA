import { DynamicItemGenerator, ERank, ESpawnType, GetStructType } from "s2cfgtojson";

export const meta = {
  interestingFiles: ["DynamicItemGenerator.cfg"],
  interestingContents: [],
  prohibitedIds: [],
  interestingIds: [],
  description: `
    This mode does only one thing: traders no longer sell you weapons or armor.
[hr][/hr]
🪓 Welcome to the ultimate survival challenge for Stalker 2 purists!
[hr][/hr]
It is meant to be used in other collections of mods.
    `,
  changenote: "Update for 1.6",
  entriesTransformer: (entries: DynamicItemGenerator["entries"]) => {
    if (entries.SID.includes("Trade")) {
      transformTrade(entries);
    } else {
      return null;
    }

    if (Object.values(entries.ItemGenerator.entries).every((e) => Object.keys(e.entries || {}).length === 0)) {
      return null;
    }
    return entries;
  },
};

const transformTrade = (entries: DynamicItemGenerator["entries"]) => {
  Object.values(entries.ItemGenerator.entries)
    .filter((e) => e.entries)
    .forEach((e) => {
      // noinspection FallThroughInSwitchStatementJS
      switch (e.entries?.Category) {
        case "EItemGenerationCategory::BodyArmor":
        case "EItemGenerationCategory::Head":
        case "EItemGenerationCategory::WeaponPrimary":
        case "EItemGenerationCategory::WeaponPistol":
        case "EItemGenerationCategory::WeaponSecondary":
          e.entries = { ReputationThreshold: 1000000 } as unknown as typeof e.entries;
          break;
        default:
          e.entries = {} as unknown as typeof e.entries;
          break;
      }
    });
};
