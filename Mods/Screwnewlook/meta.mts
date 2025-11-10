import { MetaContext, MetaType } from "../../src/metaType.mjs";
import { ArmorPrototype, MeshGeneratorPrototype, MeshPrototype, Struct } from "s2cfgtojson";
import { logger } from "../../src/logger.mjs";

export const meta: MetaType<MeshGeneratorPrototype> = {
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
  onFinish: () => {
    logger.log("Screwnewlook mod finished processing.");
  },
};

function structTransformer(struct: MeshGeneratorPrototype, context: MetaContext<MeshGeneratorPrototype>) {
  if (
    context.filePath.endsWith("/MeshGeneratorPrototypes/QuestMeshGeneratorPrototypes.cfg") &&
    struct.SID === "RostokTechnician_MeshGenerator"
  ) {
    return Object.assign(struct.fork(), {
      MergedMesh: `SkeletalMesh'/Game/_STALKER2/SkeletalMeshes/characters/full_merged/SK_shurup.SK_shurup'`,
    });
  }

  return null;
}

structTransformer._name = "Screwnewlook";
structTransformer.files = [
  "/MeshGeneratorPrototypes/QuestMeshGeneratorPrototypes.cfg",
  "/BodyMeshPrototypes/AttachMeshPrototypes.cfg",
];
