import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import {
  instance as playerResearchRegistryInstance,
  PlayerResearchRegistry,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  AvailableCityBuildItemsRegistry,
  instance as availableCityBuildItemsRegistryInstance,
} from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import {
  AdvanceRegistry,
  instance as advanceRegistryInstance,
} from '@civ-clone/core-science/AdvanceRegistry';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import {
  AvailableGovernmentRegistry,
  instance as availableGovernmentRegistryInstance,
} from '@civ-clone/core-government/AvailableGovernmentRegistry';

export const setUpCities = async (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  availableBuildItemsRegistry: AvailableCityBuildItemsRegistry = availableCityBuildItemsRegistryInstance,
  advanceRegistry: AdvanceRegistry = advanceRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance,
  availableGovernmentRegistry: AvailableGovernmentRegistry = availableGovernmentRegistryInstance
): Promise<[City, City, City]> => {
  const city = await setUpCity({
      ruleRegistry,
      playerWorldRegistry,
    }),
    friendlyCity = await setUpCity({
      ruleRegistry,
      playerWorldRegistry,
      player: city.player(),
      tile: city.tile().getNeighbour('e'),
      world: city.tile().map(),
    }),
    enemyCity = await setUpCity({
      ruleRegistry,
      playerWorldRegistry,
      tile: friendlyCity.tile().getNeighbour('e'),
      world: city.tile().map(),
    });

  cityBuildRegistry.register(
    new CityBuild(city, availableBuildItemsRegistry, ruleRegistry),
    new CityBuild(friendlyCity, availableBuildItemsRegistry, ruleRegistry),
    new CityBuild(enemyCity, availableBuildItemsRegistry, ruleRegistry)
  );

  playerResearchRegistry.register(
    new PlayerResearch(city.player(), advanceRegistry, ruleRegistry),
    new PlayerResearch(enemyCity.player(), advanceRegistry, ruleRegistry)
  );

  playerGovernmentRegistry.register(
    new PlayerGovernment(
      city.player(),
      availableGovernmentRegistry,
      ruleRegistry
    ),
    new PlayerGovernment(
      enemyCity.player(),
      availableGovernmentRegistry,
      ruleRegistry
    )
  );

  return [city, friendlyCity, enemyCity];
};

export default setUpCities;
