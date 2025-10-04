import { Entries, MutantBase, Struct } from "s2cfgtojson";

export const meta = {
  interestingFiles: [
    "BlindDog.cfg",
    "Bloodsucker.cfg",
    "Boar.cfg",
    "Burer.cfg",
    "Cat.cfg",
    "Chimera.cfg",
    "Controller.cfg",
    "Deer.cfg",
    "Flesh.cfg",
    "MutantBase.cfg",
    "Poltergeist.cfg",
    "PseudoDog.cfg",
    "Pseudogiant.cfg",
    "Snork.cfg",
    "Tushkan.cfg",
  ],
  interestingContents: [],
  prohibitedIds: [],
  interestingIds: [],
  description: `
This mode does only one thing: mobs don't wear armor![h1][/h1]
Specifically: sets Strike AP to 0 for mutants, making expansive ammo truly the best for killing them.[h1][/h1]
Meant to be used in other collections of mods.[h1][/h1]
[h1][/h1]
Compatibility: this mods does not modify any existing .cfg files, only extends mutant's object prototypes via new files.
 `,
  changenote: "Update for 1.6",
  entriesTransformer: (entries: MutantBase["entries"]) => {
    if (!entries.Protection || !entries.Protection.entries) {
      return null;
    }

    entries.Protection.entries = { Strike: 0.0001 } as any; // Set Strike protection to 0 for all mobs
    return { Protection: entries.Protection, SID: entries.SID };
  },
};
