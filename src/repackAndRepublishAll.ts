import { validMods } from "./base-paths.mts";
import { spawnSync } from "child_process";
import { logger } from "./logger.mts";

await Promise.all(
  validMods.map(async (mod) => {
    logger.log(`\n\n=== Repacking Mod: ${mod} ===\n\n`);
    const fullCmd = `node --import file:${process.env.NODE_TS_TRANSFORMER} ./prepare-configs.mts`;
    logger.log("Using command: " + fullCmd + "\n\nExecuting...\n");
    spawnSync(fullCmd, {
      stdio: "inherit",
      cwd: import.meta.dirname,
      shell: "/usr/bin/bash",
      env: { ...process.env, MOD_NAME: mod },
    });
  }),
);
1;
