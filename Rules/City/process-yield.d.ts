import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
export declare const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => ProcessYield[];
export default getRules;
