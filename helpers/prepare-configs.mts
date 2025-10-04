import { GetStructType, Struct } from "s2cfgtojson";
import path from "node:path";
import * as fs from "node:fs";
import dotEnv from "dotenv";
import { Meta } from "./meta.mjs";

// scan all local .cfg files
const rootDir = path.join(import.meta.dirname, "..");
dotEnv.config({ path: path.join(rootDir, "helpers", ".env") });
const nestedDir = path.join("Stalker2", "Content", "GameLite");
const BASE_CFG_DIR = path.join(process.env.SDK_PATH, nestedDir);
const emptyMeta = `
  import { Struct, Entries } from "s2cfgtojson";
  type StructType = Struct<{}>;
  export const meta = {
    interestingFiles: [],
    interestingContents: [],
    prohibitedIds: [],
    interestingIds: [],
    description: "",
    changenote: "",
    getEntriesTransformer: () => (entries: Entries) => entries,
  };
`.trim();

function getCfgFiles() {
  const cfgFiles = [];
  function scanAllDirs(start: string) {
    const files = fs.readdirSync(start);
    for (const file of files) {
      if (fs.lstatSync(path.join(start, file)).isDirectory() && !file.includes("DLCGameData")) {
        scanAllDirs(path.join(start, file));
      } else if (file.endsWith(".cfg")) {
        cfgFiles.push(path.join(start, file));
      }
    }
  }

  scanAllDirs(BASE_CFG_DIR);
  return cfgFiles;
}

const MOD_NAME = process.env.MOD_NAME;
const modFolder = path.join(rootDir, "Mods", MOD_NAME);
const modFolderRaw = path.join(modFolder, "raw");
const modFolderSteam = path.join(modFolder, "steamworkshop");

if (!fs.existsSync(modFolderSteam)) fs.mkdirSync(modFolderSteam, { recursive: true });

const metaPath = path.join(modFolder, "meta.mts");
if (!fs.existsSync(metaPath)) fs.writeFileSync(metaPath, emptyMeta);

const { meta } = (await import(metaPath)) as { meta: Meta<Struct> };
const { interestingIds, interestingFiles, interestingContents, prohibitedIds, getEntriesTransformer = () => meta.entriesTransformer } = meta;

getCfgFiles()
  .filter((file) => interestingFiles.some((i) => file.includes(`/${i}`)))
  .map((filePath, fileIndex) => {
    const entriesTransformer = getEntriesTransformer({ filePath });
    if (!entriesTransformer) {
      return;
    }
    const pathToSave = path.parse(filePath.slice(BASE_CFG_DIR.length + 1));
    const rawContent = fs.readFileSync(filePath, "utf8");
    if (interestingContents?.length && !interestingContents.some((i) => rawContent.includes(i))) {
      return;
    }

    const array = Struct.fromString(rawContent) as GetStructType<{}>[];

    const structsById: Record<string, Struct> = Object.fromEntries(array.map((s) => [s.__internal__.rawName, s]));

    const extraStructs = [];
    const processedStructs: Struct[] = [];

    for (let index = 0; index < array.length; index++) {
      const s = array[index];
      const id = s.__internal__.rawName;
      if (!id) continue;
      if (interestingIds?.length && !interestingIds.some((i) => id.includes(i))) continue;
      if (prohibitedIds?.length && prohibitedIds.some((i) => id.includes(i))) continue;
      const clone = s.fork(true);
      clone.__internal__.rawName = id;
      clone.__internal__.refkey = id;
      clone.__internal__.refurl = "../" + pathToSave.base;
      const processedStruct = entriesTransformer(clone, {
        index,
        fileIndex,
        array,
        filePath,
        structsById,
        extraStructs,
      });

      if (processedStruct) {
        delete processedStruct.__internal__.refkey;
        delete processedStruct.__internal__.refurl;

        processedStructs.push(processedStruct);
      }
    }
    processedStructs.push(
      ...extraStructs.filter(Boolean).map((s) => {
        return s;
      }),
    );

    if (processedStructs.length) {
      const cfgEnclosingFolder = path.join(modFolderRaw, nestedDir, pathToSave.dir, pathToSave.name);

      if (!fs.existsSync(cfgEnclosingFolder)) fs.mkdirSync(cfgEnclosingFolder, { recursive: true });
      const resultingFilename = path.join(cfgEnclosingFolder, `${pathToSave.name}_patch_${MOD_NAME}.cfg`);
      fs.writeFileSync(resultingFilename, processedStructs.map((s) => s.toString()).join("\n\n"));
    }
    return processedStructs;
  });
meta.onFinish?.();

await import("./push-to-sdk.mts");
