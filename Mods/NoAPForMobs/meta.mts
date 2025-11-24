import { MutantBase } from "s2cfgtojson";
import { MetaType } from "../../src/metaType.mjs";

export const meta: MetaType<MutantBase> = {
  description: `
This mode does only one thing: mobs don't wear armor![h1][/h1]
Specifically: sets Strike AP to 0 for mutants, making expansive ammo truly the best for killing them.[h1][/h1]
Meant to be used in other collections of mods.[h1][/h1]
[h1][/h1]
Compatibility: this mods does not modify any existing .cfg files, only extends mutant's object prototypes via new files.
 `,
  changenote: "Update for 1.7.1",
  structTransformers: [entriesTransformer],
};

function entriesTransformer(struct: MutantBase) {
  if (!struct.Protection) {
    return null;
  }
  return Object.assign(struct.fork(), {
    Protection: Object.assign(struct.Protection.fork(), { Strike: 0.0001 }),
  });
}

entriesTransformer.files = [
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
];
