
import { MetaType } from "../../src/metaType.mjs";

export const meta: MetaType<Struct> = {
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

function structTransformer(struct: Struct) {
  if (struct.SID !== "Hard") {
    return null;
  }
  return Object.assign(struct.fork(), {});
}
 
structTransformer.files = [ todo ];