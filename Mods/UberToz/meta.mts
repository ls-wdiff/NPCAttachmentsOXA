import { MetaContext, MetaType } from "../../src/metaType.mjs";
import { AttachPrototype, Struct, UpgradePrototype, WeaponGeneralSetupPrototype } from "s2cfgtojson";

export const meta: MetaType<WeaponGeneralSetupPrototype> = {
  description: `
Adds various attachments to TOZ 
[hr][/hr]
 [h1][/h1]
 [h1][/h1]
[hr][/hr]
bPatches:
 [list]
 [*] WeaponGeneralSetupPrototypes.cfg
 [/list]
`,
  changenote: "Initial release",
  structTransformers: [structTransformer],
};

const tozRailUpgrade = new Struct({
  SID: "GunTOZ_Upgrade_Attachment_Attachment_Rail",
  Text: "sid_upgrades_GunD12_Upgrade_Attachment_Rail_name", // todo when they release localization tools
  Hint: "sid_upgrades_GunD12_Upgrade_Attachment_Rail_description", // todo when they release localization tools

  Image: `Texture2D'/Game/GameLite/FPS_Game/UIRemaster/UITextures/PDA/Upgrades/Weapons/Shotgun/D12/Body/Module/toz_top_rail_upgrade_icon.toz_top_rail_upgrade_icon'`,
  BaseCost: 11700,
  VerticalPosition: "EUpgradeVerticalPosition::Top",
  IsModification: true,
  AttachPrototypeSIDs: new Struct({ 0: "TopRailAKU" }),
  UpgradeTargetPart: "EUpgradeTargetPartType::Body",
}) as UpgradePrototype;
tozRailUpgrade.__internal__.isRoot = true;
tozRailUpgrade.__internal__.rawName = tozRailUpgrade.SID;

const GunThreeLine_Scope = new Struct({
  AttachPrototypeSID: "GunThreeLine_Scope",
  Socket: "X4ScopeSocket",
  IconPosX: 60,
  IconPosY: 0,
  AimMuzzleVFXSocket: "X4ScopeMuzzle",
  AimShellShutterVFXSocket: "X4ScopeShells",
  WeaponSpecificIcon: `Texture2D'/Game/_STALKER2/SkeletalMeshes/weapons/shg/TOZ34/toz_threeline_scope.toz_threeline_scope'`,
  BlockingUpgradeIDs: new Struct({ 0: tozRailUpgrade.SID }),
});

const RU_X2Scope_1 = new Struct({
  AttachPrototypeSID: "RU_X2Scope_1",
  Socket: "X2ScopeSocket",
  IconPosX: 155,
  IconPosY: 9,
  AimMuzzleVFXSocket: "X2ScopeMuzzle",
  AimShellShutterVFXSocket: "X2ScopeShells",
  RequiredUpgradeIDs: new Struct({ 0: tozRailUpgrade.SID }),
  WeaponSpecificIcon: `Texture2D'/Game/_STALKER2/SkeletalMeshes/weapons/shg/TOZ34/toz_x2_scope.toz_x2_scope'`,
});

const RU_ColimScope_1 = new Struct({
  AttachPrototypeSID: "RU_ColimScope_1",
  Socket: "ColimScopeSocket",
  IconPosX: 155,
  IconPosY: 9,
  AimMuzzleVFXSocket: "X2ScopeMuzzle",
  AimShellShutterVFXSocket: "X2ScopeShells",
  RequiredUpgradeIDs: new Struct({ 0: tozRailUpgrade.SID }),
  WeaponSpecificIcon: `Texture2D'/Game/_STALKER2/SkeletalMeshes/weapons/shg/TOZ34/toz_colim_scope.toz_colim_scope'`,
});

const TopRailAKU = new Struct({
  AttachPrototypeSID: `TopRailAKU`,
  Socket: `TopRailSocket`,
  IconPosX: 0,
  IconPosY: 0,
  RequiredUpgradeIDs: new Struct({ 0: tozRailUpgrade.SID }),
  WeaponSpecificIcon: `Texture2D'/Game/_STALKER2/SkeletalMeshes/weapons/shg/TOZ34/toz_top_rail.toz_top_rail'`,
});

function structTransformer(
  struct: WeaponGeneralSetupPrototype | UpgradePrototype | AttachPrototype,
  context: MetaContext<WeaponGeneralSetupPrototype | UpgradePrototype | AttachPrototype>,
) {
  if (context.filePath.endsWith("/UpgradePrototypes.cfg") && struct.SID === "GunD12_Upgrade_Attachment_Rail") {
    context.extraStructs.push(tozRailUpgrade);
  }

  if (context.filePath.endsWith("/WeaponGeneralSetupPrototypes.cfg")) {
    const structT = struct as WeaponGeneralSetupPrototype;
    if (structT.SID === "GunTOZ_SG") {
      const fork = structT.fork();
      fork.CompatibleAttachments ||= new Struct() as any;
      fork.CompatibleAttachments.addNode(GunThreeLine_Scope, "GunThreeLine_Scope");
      fork.CompatibleAttachments.addNode(RU_X2Scope_1, "RU_X2Scope_1");
      fork.CompatibleAttachments.addNode(RU_ColimScope_1, "RU_ColimScope_1");
      fork.CompatibleAttachments.addNode(TopRailAKU, "TopRailAKU");
      return fork;
    }
    if (structT.SID === "GunThreeLine_SP_GS") {
      const fork = structT.fork();
      fork.PreinstalledAttachmentsItemPrototypeSIDs = structT.PreinstalledAttachmentsItemPrototypeSIDs.fork(true);
      fork.PreinstalledAttachmentsItemPrototypeSIDs["0"].bHiddenInInventory = false;
      return fork;
    }
  }
  if (context.filePath.endsWith("/AttachPrototypes.cfg")) {
    if (struct.SID === "GunThreeLine_Scope") {
      const structT = struct as AttachPrototype;
      const fork = structT.fork();
      fork.Icon = `Texture2D'/Game/_STALKER2/SkeletalMeshes/weapons/shg/TOZ34/threeline_scope_icon.threeline_scope_icon'`;
      fork.Cost = 9500.0;
      fork.Weight = 0.6;
      fork.FittingWeaponsSIDs = structT.FittingWeaponsSIDs.fork();
      fork.FittingWeaponsSIDs.addNode("GunTOZ_SG", "GunTOZ_SG");
      return fork;
    }
  }

  return null;
}

structTransformer.files = ["/WeaponGeneralSetupPrototypes.cfg", "/UpgradePrototypes.cfg", "/AttachPrototypes.cfg"];
