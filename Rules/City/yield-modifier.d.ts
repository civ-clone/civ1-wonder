import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
export declare const newtonImprovements: (typeof CityImprovement)[];
/** Isaac Newton's College adds 1/`newtonDivisor` of the base science for each of `newtonImprovements`. */
export declare const newtonDivisor: number;
/** Hoover Dam adds 1/`hooverDivisor` of the base shields, as a plant. */
export declare const hooverDivisor: number;
/** SETI adds 1/`setiDivisor` of the science total. */
export declare const setiDivisor: number;
export declare const plants: (typeof CityImprovement)[];
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => YieldModifier[];
export default getRules;
