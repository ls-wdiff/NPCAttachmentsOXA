import { Struct, Entries } from "s2cfgtojson";
type StructType = Struct<{}>;
export const meta = {
  interestingFiles: [],
  interestingContents: [],
  prohibitedIds: [],
  interestingIds: [],
  description: "",
  changenote: "",
  getEntriesTransformer: () => (entries: Entries) => {
    return entries;
  },
};
