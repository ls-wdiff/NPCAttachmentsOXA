import { DialogChainPrototype } from "s2cfgtojson";

import { EntriesTransformer } from "../../src/meta-type.mts";

let oncePerTransformer = false;

/**
 */
export const transformDialogChainPrototypes: EntriesTransformer<DialogChainPrototype> = async (struct) => {
  if (!oncePerTransformer) {
    oncePerTransformer = true;
  }
  return null;
};
transformDialogChainPrototypes.files = [];
