#!/usr/bin/node

import { Struct } from "s2cfgtojson";
import path from "node:path";
import * as fs from "node:fs";

import dotEnv from "dotenv";
import { read } from "fs";

dotEnv.config();
// scan all local .cfg files
const rootDir = path.join(import.meta.dirname, "..");
const baseCfgDir = path.join("Stalker2", "Content", "GameLite");
const readOneFile = (file) => fs.readFileSync(file, "utf8");

function getCfgFiles() {
  function scanAllDirs(start: string, cb: (file: string) => void) {
    const files = fs.readdirSync(start);
    for (const file of files) {
      if (fs.lstatSync(path.join(start, file)).isDirectory()) {
        scanAllDirs(path.join(start, file), cb);
      } else if (file.endsWith(".cfg")) {
        cb(path.join(start, file));
      }
    }
  }

  const cfgFiles = [];
  scanAllDirs(path.join(rootDir, baseCfgDir), (file) => {
    cfgFiles.push(file);
  });
  return cfgFiles;
}
const MOD_NAME = process.env.MOD_NAME;
const interestingFiles = [];
const modFolder = path.join(rootDir, "Mods", MOD_NAME);
const modFolderRaw = path.join(modFolder, "raw");
const modFolderSteam = path.join(modFolder, "steamworkshop");
if (!fs.existsSync(modFolderSteam)) {
  fs.mkdirSync(modFolderSteam, { recursive: true });
}
const prohibitedIds = [];
const interstingIds = new Set([
  /*  "Jemmy_Neutral_Armor",
  "Newbee_Neutral_Armor",
  "Nasos_Neutral_Armor",
  "Zorya_Neutral_Armor",
  "SEVA_Neutral_Armor",
  "Exoskeleton_Neutral_Armor",
  "SkinJacket_Bandit_Armor",
  "Jacket_Bandit_Armor",
  "Middle_Bandit_Armor",
  "Light_Mercenaries_Armor",
  "Exoskeleton_Mercenaries_Armor",
  "Heavy_Mercenaries_Armor",
  "Default_Military_Armor",
  "Heavy2_Military_Armor",
  "Anomaly_Scientific_Armor",
  "HeavyAnomaly_Scientific_Armor",
  "SciSEVA_Scientific_Armor",
  "Rook_Svoboda_Armor",
  "Battle_Svoboda_Armor",
  "SEVA_Svoboda_Armor",
  "Heavy_Svoboda_Armor",
  "HeavyExoskeleton_Svoboda_Armor",
  "Exoskeleton_Svoboda_Armor",
  "Rook_Dolg_Armor",
  "Battle_Dolg_Armor",
  "SEVA_Dolg_Armor",
  "Heavy_Dolg_Armor",
  "HeavyExoskeleton_Dolg_Armor",
  "Exoskeleton_Dolg_Armor",
  "Battle_Monolith_Armor",
  "HeavyAnomaly_Monolith_Armor",
  "HeavyExoskeleton_Monolith_Armor",
  "Exoskeleton_Monolith_Armor",
  "Battle_Varta_Armor",
  "BattleExoskeleton_Varta_Armor",
  "Battle_Spark_Armor",
  "HeavyAnomaly_Spark_Armor",
  "SEVA_Spark_Armor",
  "HeavyBattle_Spark_Armor",

  "Light_Duty_Helmet",
  "Heavy_Duty_Helmet",
  "Heavy_Svoboda_Helmet",
  "Heavy_Varta_Helmet",
  "Heavy_Military_Helmet",
  "Light_Mercenaries_Helmet",
  "Light_Military_Helmet",
  "Battle_Military_Helmet",
  "Light_Bandit_Helmet",
  "Light_Neutral_Helmet",

  "GunPM_HG",
  "GunUDP_HG",
  "GunAPB_HG",
  "GunM10_HG",
  "GunRhino_HG",
  "GunKora_HG",
  "GunViper_PP",
  "GunAKU_PP",
  "GunBucket_PP",
  "GunIntegral_PP",
  "GunZubr_PP",
  "GunAK74_ST",
  "GunM16_ST",
  "GunG37_ST",
  "GunFora_ST",
  "GunGrim_ST",
  "GunGvintar_ST",
  "GunKharod_ST",
  "GunLavina_ST",
  "GunDnipro_ST",
  "GunPKP_MG",
  "GunObrez_SG",
  "GunTOZ_SG",
  "GunM860_SG",
  "GunSPSA_SG",
  "GunD12_SG",
  "GunRam2_SG",
  "GunSVDM_SP",
  "GunMark_SP",
  "GunM701_SP",
  "GunSVU_SP",
  "GunThreeLine_SP",
  "GunGauss_SP",
  "GunRpg7_GL",*/
]);

const total = getCfgFiles()
  .filter((file) => interestingFiles.some((i) => file.includes(i)))
  .filter((file) => {
    const oneFile = readOneFile(file);
    return oneFile.includes("Medkit");
  })
  .map((file) => {
    console.log(`Parsing ${file}`);
    const pathToSave = path.parse(file.slice(path.join(rootDir, baseCfgDir).length + 1));

    const cfgEnclosingFolder = path.join(modFolderRaw, baseCfgDir, pathToSave.dir, pathToSave.name);

    const structs = Struct.fromString<Struct<{ SpawnOnStart?: boolean; SID?: string; SpawnedPrototypeSID?: string }>>(
      readOneFile(file),
    )
      .filter(
        (s) => s.entries.SID && prohibitedIds.every((id) => !s.entries.SID.includes(id)),
        // && interstingIds.has(s.entries.SpawnedPrototypeSID),
      )
      .map((s) => {
        s.refurl = "../" + pathToSave.base;
        s.refkey = s.entries.SID;
        s._id = `${MOD_NAME}${idIsArrayIndex(s._id) ? "" : `_${s._id}`}`;
        s.entries = { SpawnOnStart: false };
        return s;
      });

    if (structs.length) {
      if (!fs.existsSync(cfgEnclosingFolder)) {
        fs.mkdirSync(cfgEnclosingFolder, { recursive: true });
      }
      fs.writeFileSync(
        path.join(cfgEnclosingFolder, `${MOD_NAME}${pathToSave.base}`),
        structs.map((s) => s.toString()).join("\n\n"),
      );
    }
    return structs;
  })
  .flat();

console.log(`Total: ${total.length} structs processed.`);

function idIsArrayIndex(id: string): boolean {
  return id && Struct.isNumber(Struct.extractKeyFromBrackets(id));
}
