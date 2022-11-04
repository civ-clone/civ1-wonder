import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import City from '@civ-clone/core-city/City';

export const hasCityImprovement = (
  CityImprovementType: typeof CityImprovement,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
) =>
  new Criterion((city: City) =>
    cityImprovementRegistry
      .getByCity(city)
      .some((cityImprovement) => cityImprovement instanceof CityImprovementType)
  );
