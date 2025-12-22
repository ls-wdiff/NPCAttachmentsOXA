import { MetaType } from "../../src/metaType.mjs";
import { DialogPrototype, QuestNodePrototype, Struct } from "s2cfgtojson";
import { deepMerge } from "../../src/deepMerge.mjs";
import { RSQLessThan3QuestNodesSIDs, RSQRandomizerQuestNodesSIDs, RSQSetDialogQuestNodesSIDs } from "../../src/consts.mjs";
import { markAsForkRecursively } from "../../src/markAsForkRecursively.mts";

export const meta: MetaType<Struct> = {
  description: `
This mod does one thing only: expands the dialogue options offered by NPCs when requesting side quests.
[hr][/hr] 
bPatches: 
[list]
[*] /DialogPrototypes/EQ197_QD_Orders.cfg
[*] /QuestNodePrototypes/RSQ01.cfg
[*] /QuestNodePrototypes/RSQ04.cfg
[*] /QuestNodePrototypes/RSQ05.cfg
[*] /QuestNodePrototypes/RSQ06_C00___SIDOROVICH.cfg
[*] /QuestNodePrototypes/RSQ07_C00_TSEMZAVOD.cfg
[*] /QuestNodePrototypes/RSQ08_C00_ROSTOK.cfg
[*] /QuestNodePrototypes/RSQ09_C00_MALAHIT.cfg
[*] /QuestNodePrototypes/RSQ10_C00_HARPY.cfg
[/list]
`,
  changenote: "Initial release",
  structTransformers: [transformDialogPrototypes, transformQuestNodePrototypes],
};
const mutantPartsVarSet = new Set(["MutantLootQuestWeak", "MutantLootQuestMedium", "MutantLootQuestStrong"]);

export function transformDialogPrototypes(struct: DialogPrototype) {
  /**
   * Show all dialog options for mutant parts quests regardless of what devs intended lol
   */
  if (struct.SID === "EQ197_QD_Orders_WaitForReply") {
    const fork = struct.fork();
    fork.NextDialogOptions = new Struct() as any;
    struct.NextDialogOptions.forEach(([k, option]) => {
      const optionFork = option.fork();
      optionFork.Conditions = new Struct({
        "0": new Struct({
          "0": new Struct({
            ConditionComparance: "EConditionComparance::NotEqual",
            VariableValue: -1,
          }),
        }),
      }) as any;
      fork.NextDialogOptions.addNode(optionFork, k);
    });
    return markAsForkRecursively(fork);
  }

  if (mutantPartsVarSet.has(struct.Conditions?.["0"]["0"].GlobalVariablePrototypeSID)) {
    const fork = struct.fork();
    deepMerge(fork, { Conditions: new Struct({ "0": new Struct({ "0": new Struct({}) }) }) });
    fork.Conditions["0"]["0"].ConditionComparance = "EConditionComparance::NotEqual";
    fork.Conditions["0"]["0"].VariableValue = -1;
    return markAsForkRecursively(fork);
  }
}

transformDialogPrototypes.files = ["/DialogPrototypes/EQ197_QD_Orders.cfg"];

export function transformQuestNodePrototypes(struct: QuestNodePrototype, context) {
  if (RSQLessThan3QuestNodesSIDs.has(struct.SID)) {
    const total = context.structsById[RSQRandomizerQuestNodesSIDs.find((key) => !!context.structsById[key])].OutputPinNames.entries().length;
    return markAsForkRecursively(
      deepMerge(struct.fork(), {
        Conditions: new Struct({
          // as of 1.7 all of them are [0][0]
          0: new Struct({
            0: new Struct({ VariableValue: total }),
          }),
        }),
      }),
    );
  }
  if (RSQSetDialogQuestNodesSIDs.has(struct.SID)) {
    let connectionIndex: string;
    const [launcherIndex] = struct.Launchers.entries().find((e) => {
      return e[1].Connections.entries().find((e1) => {
        connectionIndex = e1[0];
        return RSQLessThan3QuestNodesSIDs.has(e1[1].SID);
      });
    });
    return markAsForkRecursively(
      deepMerge(struct.fork(), {
        Launchers: new Struct({
          [launcherIndex]: new Struct({
            Connections: new Struct({
              [connectionIndex]: new Struct({
                Name: "True",
              }),
            }),
          }),
        }),
      }),
    );
  }
}

transformQuestNodePrototypes.files = [
  "/QuestNodePrototypes/RSQ01.cfg",
  "/QuestNodePrototypes/RSQ04.cfg",
  "/QuestNodePrototypes/RSQ05.cfg",
  "/QuestNodePrototypes/RSQ06_C00___SIDOROVICH.cfg",
  "/QuestNodePrototypes/RSQ07_C00_TSEMZAVOD.cfg",
  "/QuestNodePrototypes/RSQ08_C00_ROSTOK.cfg",
  "/QuestNodePrototypes/RSQ09_C00_MALAHIT.cfg",
  "/QuestNodePrototypes/RSQ10_C00_HARPY.cfg",
];
