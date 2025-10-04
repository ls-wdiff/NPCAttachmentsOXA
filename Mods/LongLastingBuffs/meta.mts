import { Struct, Entries } from "s2cfgtojson";
type StructType = Struct<{}>;
export const meta = {
  interestingFiles: [],
  interestingContents: [],
  prohibitedIds: [],
  interestingIds: [],
  description: `
  [h3]Makes some consumables last longer, with the same value (antirad remove radiation slowly).[/h3]
    [list]
  [*] 🔋 Limited Edition Energy Drink: Stamina buff duration increased from 30 seconds to 5 minutes
  [*] 🔋 Energy Drink: Reduced Cost of Stamina Per Action duration increased from 30 seconds to 5 minutes
  [*] 🔋 Energy Drink: Stamina buff duration increased from 45 seconds to 7.5 minutes
  [*] 😴 Energy Drink: Sleepiness reduction duration increased from 3 seconds to 30 seconds
  [*] 🔋 Water: Stamina buff duration increased from 5 seconds to 50 seconds
  [*] 🔋 Water: Reduced Cost of Stamina Per Action duration increased from 30 seconds to 5 minutes
  [*] 🩸 Bandage: Bleeding control duration increased from 2 seconds to 20 seconds
  [*] 🩸 Barvinok: Bleeding control duration increased from 3 minutes to 30 minutes
  [*] 🩸 Medkit: Bleeding control duration increased from 2 seconds to 20 seconds
  [*] 🩸 Army Medkit: Bleeding control duration increased from 2 seconds to 20 seconds
  [*] 🩸 Scientist Medkit: Bleeding control duration increased from 2 seconds to 20 seconds
  [*] ☢️ Scientist Medkit: Radiation reduction duration increased from 2 seconds to 20 seconds
  [*] ☢️ Antirad: Radiation reduction duration increased from 2 seconds to 20 seconds
  [*] ☢️ Beer: Radiation reduction duration increased from 2 seconds to 20 seconds
  [*] ☢️ Vodka: Radiation reduction duration increased from 2 seconds to 20 seconds
  [*] ☢️ Dvupalov Vodka: Radiation reduction duration increased from 10 seconds to 100 seconds
  [*] 🧠 Dvupalov Vodka: PSY Protection duration increased from 90 seconds to 15 minutes
  [*] 🧠 PSY Block: PSY Protection duration increased from 1 minute to 10 minutes
  [*] 🏋️ Hercules: Weight buff duration increased from 5 minutes to 50 minutes
  [/list]`,
  changenote: "Compatible with 1.6",
  getEntriesTransformer: () => (entries: Entries) => entries,
};
