import { Meta } from "../../helpers/meta.mjs";
type EntriesType = { SID: string };
export const meta: Meta = {
  interestingFiles: [],
  interestingContents: [],

  description: "This mod does only one thing: it removes dead body markers from the compass.",
  changenote: "Update for 1.6",
  entriesTransformer: (entries: EntriesType) => null,
};
