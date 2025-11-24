import path from "node:path";
import childProcess from "node:child_process";
import * as fs from "node:fs";
import dotEnv from "dotenv";
import { modName } from "./base-paths.mjs";
import { logger } from "./logger.mjs";

dotEnv.config({ path: path.join(import.meta.dirname, "..", ".env") });
const root = path.join(import.meta.dirname, "..");
const cmd = (name: string) => {
  const packName = `${name}.pak`;

  const destinationPath = path.join(root, "steamworkshop", "Stalker2", "Mods", name, "Content", "Paks", "Windows");
  const rawPath = path.join(root, "raw");
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  return [
    process.env.REPAK_PATH,
    "pack",
    rawPath,
    packName,
    `&& mv`,
    packName,
    `'${process.env.STALKER2_MODS_FOLDER}'`,
  ].join(" ");
};

logger.log("Now packing the mod and injecting into the game...");
childProcess.execSync(cmd(modName), {
  stdio: "inherit",
  cwd: root,
  shell: "/usr/bin/bash",
});

// [ cmd.exe /c ""U:/nvme/STALKER2ZoneKit/Engine/Build/BatchFiles/RunUAT.bat" CookMod "-Project=U:/nvme/STALKER2ZoneKit/Stalker2/Stalker2.uproject" "-PluginPath=U:/nvme/STALKER2ZoneKit/Stalker2/Mods/NoInstaGibByGuards/NoInstaGibByGuards.uplugin" -TargetPlatform=Win64 "-UnrealExe=U:\nvme\STALKER2ZoneKit\Stalker2\Binaries\Win64\Stalker2ModEditor-Win64-Shipping-Cmd.exe"" -nocompile -nocompileuat ]
