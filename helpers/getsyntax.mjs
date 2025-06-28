#!/usr/bin/node

import path from "node:path";
import fs from "node:fs";

// scan all local .cfg files
const dirPath =
  "/home/sdwvit/MX500-900/games/stalker-modding/Output/Exports/Stalker2/Content/GameLite";
const dedup = (arr) => [...new Set(arr)];
const filterPrimitives = (r) =>
  r !== "true" &&
  r !== "false" &&
  r.split("").filter((l) => l.toUpperCase() !== l.toLowerCase()).length > 2 &&
  !r.includes("_") &&
  !r.includes(" ");
const pickTop1k = (arr) =>
  Object.values(
    arr.flat().reduce((mem, v) => {
      mem[v] ||= [0, v];
      mem[v][0] += 1;
      return mem;
    }, {}),
  )
    .sort((a, b) => b[0] - a[0])
    .filter((v) => v[0] >= 4)
    .map((v) => v[1]);

const readOneFile = (file) => fs.readFileSync(file, "utf8");

function parseOne(fileContent) {
  const lines = fileContent.split("\n").map((line) => line.trim());

  const leftParts = lines
    .map((line) =>
      [...line.matchAll(/([A-Z]\w+)\s*=\s*[\w:\[\]]+/g)].map(([_, m]) => m),
    )
    .flat()
    .filter(filterPrimitives);

  const rightParts = lines
    .map((line) =>
      [...line.matchAll(/\w+\s*=\s*([A-Z][^=\[\];{}'\\\/]+)/g)].map(
        ([_, m]) => m,
      ),
    )
    .flat()
    .filter(filterPrimitives);

  const structs = lines
    .map((line) => [...line.matchAll(/([A-Z]\w+) : .+/g)].map(([_, m]) => m))
    .flat()
    .filter(filterPrimitives);
  return { leftParts, rightParts, structs };
}

function getCfgFiles() {
  function scanAllDirs(start, cb) {
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
  scanAllDirs(dirPath, (file) => {
    cfgFiles.push(file);
  });
  return cfgFiles;
}

const res = getCfgFiles().map(readOneFile).map(parseOne);

const leftParts = pickTop1k(res.map((p) => p.leftParts));
const structs = pickTop1k(res.map((p) => p.structs));
const rightParts = pickTop1k(res.map((parsed) => parsed.rightParts));

fs.writeFileSync(
  path.join(import.meta.dirname, "leftParts.txt"),
  leftParts.join("\n"),
);
fs.writeFileSync(
  path.join(import.meta.dirname, "structs.txt"),
  structs.join("\n"),
);
fs.writeFileSync(
  path.join(import.meta.dirname, "rightParts.txt"),
  rightParts.join("\n"),
);
