import path from "node:path";
import childProcess from "node:child_process";
import * as fs from "node:fs";
import * as VDF from "@node-steam/vdf";

import dotEnv from "dotenv";

dotEnv.config();
const MODS_PATH = path.join(import.meta.dirname, "../Mods");
const STALKER_STEAM_ID = "1643320";
const vdfTemplate = (modPath, title, description, changenote = "Initial release") => `
"workshopitem"
{
	"appid"		"${STALKER_STEAM_ID}"
	"publishedfileid"		"0"
	"contentfolder"		"${path.join(modPath, "steamworkshop")}"
	"previewfile"			"${path.join(modPath, "512.png")}"
	"title"		"${title}"
	"description"		"${description}"
	"changenote"		"${changenote}"
}
`;

const STEAMSH_PATH = "/home/sdwvit/IdeaProjects/steamcmd/steamcmd.sh";

const cmd = (name: string, title: string, description: string, changenote = "") => {
  const modPath = path.join(MODS_PATH, name);
  const vdfFilePath = path.join(modPath, `${name}.vdf`);

  if (fs.existsSync(vdfFilePath)) {
    const vdfContent = fs.readFileSync(vdfFilePath, "utf8");
    const vdfData = VDF.parse(vdfContent);
    vdfData.workshopitem.title = title;
    vdfData.workshopitem.description = description.replace(/\n/g, "\\n").replace(/"/g, '\\"');
    vdfData.workshopitem.changenote = changenote;

    fs.writeFileSync(vdfFilePath, VDF.stringify(vdfData), "utf8");
  } else {
    fs.writeFileSync(vdfFilePath, vdfTemplate(modPath, title, description, changenote).trim(), "utf8");
  }

  return [STEAMSH_PATH, "+login", "sdwvit", "$STEAM_PASS", "+workshop_build_item", `"${vdfFilePath}"`, "+quit"].join(
    " ",
  );
};

childProcess.execSync(
  cmd(
    process.env.MOD_NAME,
    `${process.env.MOD_NAME.replace(/([A-Z])/g, " $1")} by sdwvit`,
    `This mode does only one thing: removes all 650+ medkits placed around the map for more challenging gameplay. --- Tired of those cute little medkits scattered around the map like breadcrumbs for weaklings? This mod is for players who want to feel the sting of death without any pre-placed safety nets. Increased tension. Every bullet, tripwire, and mutant encounter feels like a 10/10 horror movie. Achievement unlocked: “I DIED 47 TIMES BEFORE MY FIRST SAVE.” --- It is meant to be used in other collections of mods. Does not conflict with anything.`,
    "Update logo",
  ),
  {
    stdio: "inherit",
    cwd: MODS_PATH,
    shell: "/usr/bin/bash",
    env: process.env,
  },
);
