import { Struct, EItemType, TradePrototype } from "s2cfgtojson";

export const meta = {
  interestingFiles: ["TradePrototypes"],
  interestingContents: [],
  prohibitedIds: [],
  interestingIds: [],
  description: `
   This mode does only one thing: traders don't buy Weapons / Helmets / Armor.
[hr][/hr]
No more loot goblin.
[hr][/hr]
Warning: this makes the game more difficult and interesting.[h1][/h1]
Meant to be used in other collections of mods.
   `,
  changenote: "Updated to 1.6",
  entriesTransformer: (entries: TradePrototype["entries"]) => {
    let keepo = null;
    if (entries.TradeGenerators?.entries) {
      Object.values(entries.TradeGenerators.entries)
        .filter((tg) => tg.entries)
        .forEach((tg) => {
          tg.entries.BuyLimitations ||= new BuyLimitations() as any;
          let limitations = ["EItemType::Weapon", "EItemType::Armor"];

          limitations.forEach((itemType: EItemType) => {
            let i = 0;
            while (tg.entries.BuyLimitations.entries[i] && tg.entries.BuyLimitations.entries[i] !== itemType) {
              i++;
            }
            tg.entries.BuyLimitations.entries[i] = itemType;
          });
        });
      return { TradeGenerators: entries.TradeGenerators, SID: entries.SID };
    }
    return keepo;
  },
};

class BuyLimitations extends Struct {
  _id = "BuyLimitations";
  entries: Record<number, string> = { 0: "EItemType::Weapon", 1: "EItemType::Armor" };
}
