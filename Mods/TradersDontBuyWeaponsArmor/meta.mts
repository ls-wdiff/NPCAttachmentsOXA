import { Struct, GetStructType } from "s2cfgtojson";
type TraderEntries = GetStructType<{
  SID: "BaseTraderNPC_Template";
  TradeGenerators: {
    BuyLimitations: ("EItemType::Weapon" | "EItemType::Armor")[];
  }[];
}>["entries"];

export const meta = {
  interestingFiles: ["TradePrototypes"],
  interestingContents: [],
  prohibitedIds: [],
  interestingIds: [],
  description:
    "This mode does only one thing: traders don't buy Weapons / Helmets / Armor.\n---\nNo more loot goblin.\n---\nWarning: this makes the game more difficult and interesting.\nMeant to be used in other collections of mods.",
  changenote: "Bartenders don't buy weapons and armor also. Updated to 1.5.2",
  entriesTransformer: (entries: TraderEntries) => {
    if (entries.TradeGenerators?.entries) {
      Object.values(entries.TradeGenerators.entries)
        .filter((tg) => tg.entries)
        .forEach((tg) => {
          tg.entries.BuyLimitations ||= new BuyLimitations();
          const existing = Object.values(tg.entries.BuyLimitations.entries);
          if (existing.includes("EItemType::Weapon") && existing.includes("EItemType::Armor")) {
            return;
          }
          ["EItemType::Weapon", "EItemType::Armor"].forEach((itemType) => {
            let i = parseInt(Object.keys(tg.entries.BuyLimitations.entries)[0]) || 0;
            while (tg.entries.BuyLimitations.entries[i] && tg.entries.BuyLimitations.entries[i] !== itemType) {
              i++;
            }
            tg.entries.BuyLimitations.entries[i] = itemType;
          });
        });
      return { TradeGenerators: entries.TradeGenerators };
    }
    return null;
  },
};

class BuyLimitations extends Struct {
  _id = "BuyLimitations";
  entries: Record<number, string> = { 0: "EItemType::Weapon", 1: "EItemType::Armor" };
}
