import { BuildingComplete } from '@civ-clone/core-city-build/Rules/BulidingComplete';
import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
export declare const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  wonderRegistry?: WonderRegistry
) => BuildingComplete[];
export default getRules;
