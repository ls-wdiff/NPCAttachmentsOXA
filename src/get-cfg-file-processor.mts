import { Struct } from "s2cfgtojson";
import { EntriesTransformer } from "./metaType.mjs";
import path from "node:path";
import fs from "node:fs";
import { baseCfgDir, modFolderRaw, modName, rawCfgEnclosingFolder } from "./base-paths.mjs";
import { promisify } from "node:util";
import { logger } from "./logger.mjs";
import { L1Cache, L1CacheState } from "./l1-cache.mjs";

const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

export function getCfgFileProcessor<T extends Struct>(transformer: EntriesTransformer<T>) {
  type OneT = Struct | T | Struct[] | T[] | void | null | void[] | null[];

  return async function processOneCfgFile(filePath: string, fileIndex: number): Promise<Struct[]> {
    const pathToSave = path.parse(filePath.slice(baseCfgDir.length + 1));

    if (!(filePath.includes("SpawnActorPrototypes/WorldMap_WP/") && !filePath.endsWith("0.cfg"))) {
      logger.log(`Processing file: ${filePath}`);
    }
    if (!L1Cache[filePath]) {
      L1CacheState.needsUpdate = true;
      const rawContent = await readFile(filePath, "utf8");
      if (transformer.contents?.length && !transformer.contents.some((c) => rawContent.includes(c))) {
        L1Cache[filePath] = [];
        return [];
      }
      L1Cache[filePath] = Struct.fromString(rawContent) as T[];
    }

    const array = L1Cache[filePath] as T[];
    const structsById: Record<string, T> = Object.fromEntries(array.map((s) => [s.__internal__.rawName, s as T]));
    const extraStructs: T[] = [];

    const promises: Promise<OneT>[] = [];

    for (let index = 0; index < array.length; index++) {
      const s = array[index];
      const id = s.__internal__.rawName;
      if (!id) continue;

      promises.push(
        Promise.resolve(transformer(s as T, { index, fileIndex, array, filePath, structsById, extraStructs })).then((ps) => {
          s.__internal__.refurl = "../" + pathToSave.base;
          return ps;
        }),
      );
    }

    const processedStructs = (await Promise.all(promises))
      .map((pss) => {
        if (pss) {
          return (Array.isArray(pss) ? pss : [pss]).flat().concat(extraStructs).filter(Boolean);
        }
      })
      .flat()
      .filter(Boolean) as Struct[];

    if (processedStructs.length) {
      const cfgEnclosingFolder = path.join(modFolderRaw, rawCfgEnclosingFolder, pathToSave.dir, pathToSave.name);

      if (!(await exists(cfgEnclosingFolder))) await mkdir(cfgEnclosingFolder, { recursive: true });
      const resultingFilename = path.join(cfgEnclosingFolder, `${pathToSave.name}_patch_${modName}.cfg`);
      await writeFile(resultingFilename, processedStructs.map((s) => s.toString()).join("\n\n"));
    }
    return processedStructs;
  };
}
