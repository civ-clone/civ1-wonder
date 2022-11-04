import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import City from '@civ-clone/core-city/City';
export declare const hasCityImprovement: (
  CityImprovementType: typeof CityImprovement,
  cityImprovementRegistry?: CityImprovementRegistry
) => Criterion<[city: City]>;
