import fs from "node:fs";
import path from "node:path";

export function recursiveCfgFindAndDelete(folder: string) {
  fs.readdirSync(folder).forEach((shortFile) => {
    const file = path.join(folder, shortFile);
    if (fs.statSync(file).isDirectory()) {
      return recursiveCfgFindAndDelete(file);
    }
    if (file.endsWith(".cfg")) {
      fs.rmSync(file, { recursive: true, force: true });
    }
  });
}
