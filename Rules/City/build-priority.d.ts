import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import BuildPriority from '@civ-clone/core-city-build/Rules/BuildPriority';
export declare const wonderPriority = 1.5;
export declare const wonderShields = 5;
export declare const getRules: (
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  unitRegistry?: UnitRegistry,
  requirementRegistry?: RequirementRegistry
) => BuildPriority[];
export default getRules;
