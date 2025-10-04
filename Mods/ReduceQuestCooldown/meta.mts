import { Entries, QuestNodePrototype } from "s2cfgtojson";

export const meta = {
  interestingFiles: [
    "QuestNodePrototypes/BodyParts_Malahit.cfg",
    "QuestNodePrototypes/RSQ01.cfg",
    "QuestNodePrototypes/RSQ04.cfg",
    "QuestNodePrototypes/RSQ05.cfg",
    "QuestNodePrototypes/RSQ06_C00___SIDOROVICH.cfg",
    "QuestNodePrototypes/RSQ07_C00_TSEMZAVOD.cfg",
    "QuestNodePrototypes/RSQ08_C00_ROSTOK.cfg",
    "QuestNodePrototypes/RSQ09_C00_MALAHIT.cfg",
    "QuestNodePrototypes/RSQ10_C00_HARPY.cfg",
  ],
  interestingContents: [],
  prohibitedIds: [],
  interestingIds: [],
  description:
    "This mode does only one thing: reduces cooldown between barkeep/vendor/mechanic quests to 3 in-game hours. --- Because Waiting Is for the Weak. --- It is meant to be used in other collections of mods. Modifies quest vendor cfg files.",
  changenote: "Update for 1.6",
  entriesTransformer: (entries: QuestNodePrototype["entries"]) => {
    if (entries.InGameHours) {
      return { ...entries, InGameHours: Math.min(entries.InGameHours, 3) };
    }
    return null;
  },
};
