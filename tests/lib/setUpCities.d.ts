import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { AvailableCityBuildItemsRegistry } from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import { AdvanceRegistry } from '@civ-clone/core-science/AdvanceRegistry';
import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { AvailableGovernmentRegistry } from '@civ-clone/core-government/AvailableGovernmentRegistry';
export declare const setUpCities: (
  ruleRegistry?: RuleRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  availableBuildItemsRegistry?: AvailableCityBuildItemsRegistry,
  advanceRegistry?: AdvanceRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  availableGovernmentRegistry?: AvailableGovernmentRegistry
) => Promise<[City, City, City]>;
export default setUpCities;
