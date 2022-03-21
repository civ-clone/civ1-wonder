import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import CityYield from '@civ-clone/core-city/Rules/Yield';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  unitRegistry?: UnitRegistry
) => CityYield[];
export default getRules;
