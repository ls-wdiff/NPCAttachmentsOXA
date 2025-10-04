import { ArmorPrototype, Struct } from "s2cfgtojson";
import fs from "node:fs";
import path from "node:path";

import dotEnv from "dotenv";

dotEnv.config({ path: path.join(import.meta.dirname, "..", ".env") });
const nestedDir = path.join("Stalker2", "Content", "GameLite");
const BASE_CFG_DIR = path.join(process.env.SDK_PATH, nestedDir);

export const allDefaultArmorDefs = Object.fromEntries(
  (
    Struct.fromString(
      [fs.readFileSync(path.join(BASE_CFG_DIR, "GameData", "ItemPrototypes", "ArmorPrototypes.cfg"), "utf8")].join(
        "\n",
      ),
    ) as ArmorPrototype[]
  ).map((e) => [e.SID, e] as const),
);
