import { MetaType } from "../../src/metaType.mjs";
import { SpawnActorPrototype } from "s2cfgtojson";

export const meta: MetaType<SpawnActorPrototype> = {
  description: `
Title
[hr][/hr]
Description 1[h1][/h1]
Description 2[h1][/h1]
[hr][/hr]
Footer
`,
  changenote: "Initial release",
  structTransformers: [structTransformer],
};

function structTransformer(struct: SpawnActorPrototype) {
  if (struct.SID !== "Hard") {
    return null;
  }
  return Object.assign(struct.fork(), {});
}

structTransformer.files = [todo];
