import { Meta } from "../../helpers/meta.mjs";
type EntriesType = { SID: string };
export const meta: Meta = {
  interestingFiles: [],
  interestingContents: [],

  description: `This mod removes threat indicators. Meaning you can no longer see any markers, blue or red compass shadow indicating the presence or absence of enemies or their direction.[h1][/h1]
     [hr][/hr]
     Let's make the game scary again.[h1][/h1]
      [hr][/hr]
      It is meant to be used in other collections of mods.[h1][/h1] 
      Does not conflict with anything, well except for mods that modify compass textures.`,
  changenote: "Update for 1.6",
  entriesTransformer: (entries: EntriesType) => null,
};
