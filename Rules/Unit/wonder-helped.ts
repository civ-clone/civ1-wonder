import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import { Production } from '@civ-clone/civ1-city/Yields';
import Unit from '@civ-clone/core-unit/Unit';
import WonderHelped from '@civ-clone/base-unit-action-help-build-wonder/Rules/WonderHelped';

export const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  ruleRegistry?: RuleRegistry
) => WonderHelped[] = (
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): WonderHelped[] => [
  // The Caravan adds what it cost to build (v474.05 `ShieldsCount += 10 × Cost`, 50 for a Caravan). Nothing caps it:
  //  the shields stay if the city switches production, and anything over the Wonder's cost is lost when it completes,
  //  because `CityBuild` empties the box then.
  new WonderHelped(
    'civ1-wonder:unit/wonder-helped/add-production',
    new Effect((unit: Unit, city: City): void => {
      const cost = new BuildItem(
        unit.constructor as unknown as typeof Buildable,
        city,
        ruleRegistry
      )
        .cost()
        .value();

      cityBuildRegistry
        .getByCity(city)
        .add(new Production(cost, unit.constructor.name));
    })
  ),
];

export default getRules;
