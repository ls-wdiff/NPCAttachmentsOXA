import { MutantBase } from "s2cfgtojson";
/**
 * Sets bullet (Strike) protection to 0 for all mobs.
 */
export const getTransformMobs = (difficultyFactor: number, adjustDefence = true) => {
  async function transformMobs(struct: MutantBase) {
    if (!struct.Protection) {
      return null;
    }
    const fork = struct.fork();
    if (
      difficultyFactor !== 1 &&
      struct.SID !== "Rat" &&
      struct.SID !== "MutantBase" &&
      struct.SID !== "Poltergeist" &&
      struct.SID !== "Tushkan" &&
      struct.SID !== "Bayun" &&
      struct.SID !== "Blinddog"
    ) {
      fork.VitalParams = Object.assign(struct.VitalParams.fork(), {
        MaxHP: struct.VitalParams.MaxHP * difficultyFactor,
      });
    }
    if (adjustDefence) {
      fork.Protection = Object.assign(struct.Protection.fork(), { Strike: 0.0001 }); // Set Strike protection to 0 for all mobs
    }
    return fork;
  }
  transformMobs.files = [
    "/BlindDog.cfg",
    "/Bloodsucker.cfg",
    "/Boar.cfg",
    "/Burer.cfg",
    "/Cat.cfg",
    "/Chimera.cfg",
    "/Controller.cfg",
    "/Deer.cfg",
    "/Flesh.cfg",
    "/MutantBase.cfg",
    "/Poltergeist.cfg",
    "/PseudoDog.cfg",
    "/Pseudogiant.cfg",
    "/Snork.cfg",
    "/Tushkan.cfg",
  ];

  return transformMobs;
};
