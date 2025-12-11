import { EntriesTransformer, MetaContext, MetaType } from "../../src/metaType.mjs";
import { EGlobalVariableType, GetStructType, QuestNodePrototype, Struct } from "s2cfgtojson";
import { QuestDataTable } from "./rewardFormula.mts";
import { getLaunchers } from "../../src/struct-utils.mts";
import { allStashes } from "./stashes.mts";
import { modName } from "../../src/base-paths.mts";

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

function structTransformer(struct: Struct, context: MetaContext<Struct>) {
  if (context.filePath.endsWith("/CluePrototypes.cfg")) {
    context.extraStructs.push(...transformCluePrototypes());
  }

  if (context.filePath.includes("/QuestNodePrototypes/")) {
    hookStashSpawners(struct);
  }

  if (context.filePath.includes("GameLite/GameData/SpawnActorPrototypes/WorldMap_WP/")) {
    let fork = struct.fork();

    if (struct.SpawnType === "ESpawnType::ItemContainer") {
      return rememberAndEmptyStash(struct, fork, context);
    }

    return null;
  }

  return null;
}

function rememberAndEmptyStash(
  struct: SpawnActorPrototype,
  fork: SpawnActorPrototype,
  context: MetaContext<SpawnActorPrototype>,
) {
  if (struct.ClueVariablePrototypeSID !== "EmptyInherited" || !containers.has(struct.SpawnedPrototypeSID)) {
    return fork;
  }
  totals.ItemContainer++;
  allStashes[struct.SID] = struct;

  fork.ClueVariablePrototypeSID = getGeneratedStashSID((context.fileIndex % 100) + 1);
  fork.SpawnOnStart = false;

  return fork;
}

structTransformer.files = [
  "/CluePrototypes.cfg",
  "/QuestNodePrototypes/",
  "GameLite/GameData/SpawnActorPrototypes/WorldMap_WP/",
];
structTransformer.contains = true;

type CluePrototype = GetStructType<{
  ID: number;
  SID: string;
  Description: string;
  Type: EGlobalVariableType;
  DefaultValue: string;
}>;
const RandomStashQuestName = `RandomStashQuest`; // if you change this, also change Blueprint in SDK
const RandomStashQuestNodePrefix = `${modName}_RandomStashQuest`;
export const getStashSpawnerSID = (stashKey: string) => `${RandomStashQuestNodePrefix}_Random_${stashKey}_Spawn`;

async function hookStashSpawners(struct: QuestNodePrototype) {
  if (struct.NodeType !== "EQuestNodeType::ItemAdd") {
    return;
  }

  await waitFor(() => finishedTransformers.has(transformSpawnActorPrototypes.name));

  // only quest stashes that are hidden by this mod are interesting here
  if (!allStashes[struct.TargetQuestGuid]) {
    return;
  }

  const spawnStash = struct.fork();
  spawnStash.SID = `${struct.QuestSID}_Spawn_${struct.TargetQuestGuid}`;
  spawnStash.NodeType = "EQuestNodeType::ConsoleCommand";
  spawnStash.QuestSID = struct.QuestSID;
  spawnStash.ConsoleCommand = `XStartQuestNodeBySID ${getStashSpawnerSID(struct.TargetQuestGuid)}`;
  spawnStash.Launchers = struct.Launchers;
  const fork = struct.fork();
  fork.Launchers = getLaunchers([{ SID: spawnStash.SID, Name: "" }]);
  spawnStash.__internal__.rawName = spawnStash.SID;
  delete spawnStash.__internal__.bpatch;
  delete spawnStash.__internal__.refurl;
  delete spawnStash.__internal__.refkey;
  return [spawnStash, fork];
}

let oncePerFile = false;
export const getGeneratedStashSID = (i: number) => `Gen_Stash${i}`;

const recurringQuestsFilenames = [
  "BodyParts_Malahit",
  "RSQ01",
  "RSQ04",
  "RSQ05",
  "RSQ06",
  "RSQ07",
  "RSQ08",
  "RSQ09",
  "RSQ10",
];

/**
 * Injects 100 generated stash clue prototypes into CluePrototypes.cfg
 * Each generated struct uses `SID` = `Gen_Stash{n}` and minimal internal metadata.
 * Returns `null` to indicate no modification to the original entries.
 */
export const transformCluePrototypes = () => {
  if (!oncePerFile) {
    oncePerFile = true;
    const extraStructs: CluePrototype[] = [];
    [...new Set(QuestDataTable.map((q) => `${q.Vendor.replace(/\W/g, "")}_latest_quest_variant`))].forEach((SID) => {
      extraStructs.push(
        new Struct(`
          ${SID} : struct.begin {refkey=[0]}
             SID = ${SID}
             Type = EGlobalVariableType::Int
             DefaultValue = 0
          struct.end
      `) as CluePrototype,
      );
    });
    for (let i = 1; i <= 100; i++) {
      extraStructs.push(
        new Struct({
          __internal__: {
            refkey: "[0]",
            rawName: getGeneratedStashSID(i),
            isRoot: true,
          },
          SID: getGeneratedStashSID(i),
        }) as CluePrototype,
      );
    }
    return extraStructs;
  }

  return null;
};
