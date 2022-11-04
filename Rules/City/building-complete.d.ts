import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
export declare const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  wonderRegistry?: WonderRegistry,
  engine?: Engine
) => BuildingComplete[];
export default getRules;
