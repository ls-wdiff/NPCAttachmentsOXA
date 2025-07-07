import path from "node:path";
import childProcess from "node:child_process";
import * as fs from "node:fs";

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

const cmd = (name: string, title: string, description: string) => {
  const modPath = path.join(MODS_PATH, name);
  const vdfFilePath = path.join(modPath, `${name}.vdf`);

  if (!fs.existsSync(vdfFilePath))
    fs.writeFileSync(vdfFilePath, vdfTemplate(modPath, title, description).trim(), "utf8");

  return [
    STEAMSH_PATH,
    "+login",
    "sdwvit",
    "$STEAM_PASS",
    "+workshop_build_item",
    `"$(pwd)/${path.join(modPath, vdfFilePath)}"`,
    "+quit",
  ].join(" ");
};

childProcess.execSync(
  cmd(
    "LongLastingBuffs",
    "Long Lasting Buffs by sdwvit",
    "This mode does only one thing: increases consumables positive effects length. For example, Energy drink used to give extra stamina regen for 45 seconds, now it lasts 7.5 minutes. Meant to be used in other collections of mods.",
  ),
  {
    stdio: "inherit",
    cwd: MODS_PATH,
    shell: "/usr/bin/bash",
    env: process.env,
  },
);
