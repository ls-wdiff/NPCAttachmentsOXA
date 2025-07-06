import { describe, test, expect } from "vitest";
import { Struct } from "s2cfgtojson";
import * as fs from "node:fs";

describe("Struct", () => {
  test.skip("4", () => {
    const read = Struct.fromString<
      Struct<{
        SID?: string;
        ItemGenerator?: Struct<{ [k: number]: Struct<{ Category: string }> }>;
      }>
    >(
      fs.readFileSync(
        "/home/sdwvit/MX500-900/games/stalker-modding/Output/Exports/Stalker2/Content/GameLite/GameData/ItemGeneratorPrototypes/DynamicItemGenerator.cfg",
        "utf-8",
      ),
    );

    const prohibitedCategories = new Set([
      "EItemGenerationCategory::WeaponPrimary",
      "EItemGenerationCategory::BodyArmor",
      "EItemGenerationCategory::WeaponPistol",
      "EItemGenerationCategory::WeaponSecondary",
      "EItemGenerationCategory::Head",
    ]);
    const modified = read
      .filter(
        (s) =>
          s._id.toLowerCase().includes("trade") &&
          s.entries.SID &&
          Object.values(s.entries.ItemGenerator?.entries || {}).find((e) =>
            prohibitedCategories.has(e.entries.Category),
          ),
      )
      .map((s) => {
        s.refurl = "../DynamicItemGenerator.cfg";
        s.refkey = s.entries.SID;
        s._id = `TradersDontSellWeaponsArmor_${s._id}`;
        return s;
      });
    fs.writeFileSync(
      "/home/sdwvit/MX500-900/games/stalker-modding/Output/Exports/Mods/TradersDontSellWeaponsArmor/Stalker2/Content/GameLite/GameData/ItemGeneratorPrototypes/DynamicItemGenerator/TradersDontSellWeaponsArmor.cfg",
      modified.map((s) => s.toString()).join("\n\n"),
    );
  });
});
