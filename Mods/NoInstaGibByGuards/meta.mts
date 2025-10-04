import { GetStructType, Struct } from "s2cfgtojson";
import { WithSID } from "../../helpers/prepare-configs.mjs";
import { Meta } from "../../helpers/meta.mjs";
type EntriesType = { SID: string } & ({ BaseDamage: number } | { ApplyExtraEffectPrototypeSIDs: GetStructType<string[]> });
export const meta: Meta<WithSID & Struct<EntriesType>> = {
  interestingFiles: ["NPCWeaponSettingsPrototypes.cfg", "EffectPrototypes.cfg"],
  interestingContents: [],

  description: "This mod does only one thing: [h1][/h1]it prevents border guards from killing you instantly with their weapons. Removes instakill effect.",
  changenote: "Update for 1.6",
  entriesTransformer: (entries: EntriesType, { filePath, struct, structsById }) => {
    if (filePath.includes("NPCWeaponSettingsPrototypes.cfg")) {
      if (entries.SID.includes("Guard") && "BaseDamage" in entries) {
        entries.BaseDamage = ((structsById[struct._refkey]?.entries as Partial<typeof entries>)?.BaseDamage ?? 50) - 1;
        return entries;
      }
    }
    if (filePath.includes("EffectPrototypes.cfg")) {
      if (entries.SID === "KillVolumeEffect" && "ApplyExtraEffectPrototypeSIDs" in entries) {
        entries.ApplyExtraEffectPrototypeSIDs.entries = Object.fromEntries(
          Object.entries(entries.ApplyExtraEffectPrototypeSIDs.entries).map((e) => {
            e[1] = "empty";
            return e;
          }),
        );
        return entries;
      }
    }
    return null;
  },
};
