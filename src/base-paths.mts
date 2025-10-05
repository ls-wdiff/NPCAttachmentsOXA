import path from "node:path";
import dotEnv from "dotenv";

dotEnv.config({ path: path.join(import.meta.dirname, "..", ".env") });

export const rawCfgEnclosingFolder = path.join("Stalker2", "Content", "GameLite");
export const baseCfgDir = path.join(process.env.SDK_PATH, rawCfgEnclosingFolder);

export const modName = process.env.MOD_NAME;
export const projectRoot = path.join(import.meta.dirname, "..");
export const modFolder = path.join(projectRoot, "Mods", modName);
export const modFolderSteam = path.join(projectRoot, "Mods", modName, "steamworkshop");
export const modFolderRaw = path.join(projectRoot, "Mods", modName, "raw");

export const sdkStagedFolder = path.join(process.env.SDK_PATH, "Stalker2", "SavedMods", "Staged");
export const sdkModsFolder = path.join(process.env.SDK_PATH, "Stalker2", "Mods");
