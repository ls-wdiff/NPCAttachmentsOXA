import path from "node:path";
import childProcess from "node:child_process";
import * as fs from "node:fs";
import * as VDF from "@node-steam/vdf";

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
    "LongLastingBuffs",
    "Long Lasting Buffs by sdwvit",
    `
This mode does only one thing: increases consumables positive effects duration.

For example, Energy drink used to give extra stamina regeneration for 45 seconds, now it lasts 7.5 minutes.

Meant to be used in other collections of mods. Does not conflict with any other mod.

---
Full changelist:
🔋 Limited Edition Energy Drink: Stamina buff duration increased from 30 seconds to 5 minutes
🔋 Energy Drink: Reduced Cost of Stamina Per Action duration increased from 30 seconds to 5 minutes
🔋 Energy Drink: Stamina buff duration increased from 45 seconds to 7.5 minutes
😴 Energy Drink: Sleepiness reduction duration increased from 3 seconds to 30 seconds
🔋 Water: Stamina buff duration increased from 5 seconds to 50 seconds
🔋 Water: Reduced Cost of Stamina Per Action duration increased from 30 seconds to 5 minutes
🩸 Bandage: Bleeding control duration increased from 2 seconds to 20 seconds
🩸 Barvinok: Bleeding control duration increased from 3 minutes to 30 minutes
🩸 Medkit: Bleeding control duration increased from 2 seconds to 20 seconds
🩸 Army Medkit: Bleeding control duration increased from 2 seconds to 20 seconds
🩸 Scientist Medkit: Bleeding control duration increased from 2 seconds to 20 seconds
☢️ Scientist Medkit: Radiation reduction duration increased from 2 seconds to 20 seconds
☢️ Antirad: Radiation reduction duration increased from 2 seconds to 20 seconds
☢️ Beer: Radiation reduction duration increased from 2 seconds to 20 seconds
☢️ Vodka: Radiation reduction duration increased from 2 seconds to 20 seconds
☢️ Dvupalov Vodka: Radiation reduction duration increased from 10 seconds to 100 seconds
🧠 Dvupalov Vodka: PSY Protection duration increased from 90 seconds to 15 minutes
🧠 PSY Block: PSY Protection duration increased from 1 minute to 10 minutes
🏋️ Hercules: Weight buff duration increased from 5 minutes to 50 minutes
`.trim(),
    "Remove unused effects",
  ),
  {
    stdio: "inherit",
    cwd: MODS_PATH,
    shell: "/usr/bin/bash",
    env: process.env,
  },
);
