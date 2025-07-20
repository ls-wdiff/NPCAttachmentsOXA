import path from "node:path";
import childProcess from "node:child_process";

import dotEnv from "dotenv";
import * as fs from "node:fs";

dotEnv.config();
const MODS_PATH = path.join(import.meta.dirname, "../Mods");
const SDK_PATH = "/media/nvme2/STALKER2ZoneKit";
const STAGED_PATH = path.join(SDK_PATH, "Stalker2", "SavedMods", "Staged");

const cmd = (name: string) => {
  const folderStructure = path.join("Stalker2", "Mods", name, "Content", "Paks", "Windows");
  const sourcePath = path.join(STAGED_PATH, name, "Windows", folderStructure);
  const destinationPath = path.join(MODS_PATH, name, "steamworkshop", folderStructure);
  console.log(`Pulling staged mod from ${sourcePath}...`);
  if (fs.readdirSync(sourcePath).length === 0) {
    console.error(`No files found in source path: ${sourcePath}`);
    process.exit(1);
  }
  return ["mkdir", "-p", destinationPath, "&&", "cp", path.join(sourcePath, "*"), destinationPath].join(" ");
};

childProcess.execSync(cmd(process.env.MOD_NAME), {
  stdio: "inherit",
  cwd: MODS_PATH,
  shell: "/usr/bin/bash",
});
