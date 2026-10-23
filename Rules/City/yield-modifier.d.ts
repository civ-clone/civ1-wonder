import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => YieldModifier[];
export default getRules;
