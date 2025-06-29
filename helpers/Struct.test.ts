import { describe, test, expect } from "vitest";
import { Struct } from "./Struct";

describe("Struct", () => {
  test("toString()", () => {
    class ChimeraHPFix extends Struct {
      refurl = "../Chimera.cfg";
      refkey = "Chimera.VitalParams";
      MaxHP = 750;
      isRoot = true;
    }

    expect(new ChimeraHPFix().toString()).toBe(
      `ChimeraHPFix : struct.begin {refurl=../Chimera.cfg;refkey=Chimera.VitalParams}
   MaxHP = 750
struct.end`,
    );

    class TradersDontBuyWeaponsArmor extends Struct {
      refurl = "../TradePrototypes.cfg";
      refkey = 0;
      isRoot = true;
      TradeGenerators = new TradeGenerators();
    }
    class TradeGenerators extends Struct {
      "*" = new TradeGenerator();
    }
    class TradeGenerator extends Struct {
      BuyLimitations = new BuyLimitations();
    }
    class BuyLimitations extends Struct {
      [0] = "EItemType::Weapon";
      [1] = "EItemType::Armor";
    }

    expect(new TradersDontBuyWeaponsArmor().toString()).toBe(
      `TradersDontBuyWeaponsArmor : struct.begin {refurl=../TradePrototypes.cfg;refkey=[0]}
   TradeGenerators : struct.begin
      [*] : struct.begin
         BuyLimitations : struct.begin
            [0] = EItemType::Weapon
            [1] = EItemType::Armor
         struct.end
      struct.end
   struct.end
struct.end`,
    );
  });

  test("pad()", () => {
    expect(Struct.pad("test")).toBe("   test");
    expect(Struct.pad(Struct.pad("test"))).toBe("      test");
  });
});
