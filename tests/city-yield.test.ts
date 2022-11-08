import { Colossus, CureForCancer, HangingGardens } from '../Wonders';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import { Happiness, Trade, Unhappiness } from '@civ-clone/civ1-city/Yields';
import { Electricity, Invention } from '@civ-clone/civ1-science/Advances';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import cityYield from '@civ-clone/civ1-city/Rules/City/yield';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Advance from '@civ-clone/core-science/Advance';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import setUpCities from './lib/setUpCities';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import grow from '@civ-clone/civ1-city/Rules/City/grow';
import wonderCityYield from '../Rules/City/yield';
import TileYield from '@civ-clone/core-world/Rules/Yield';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Added from '@civ-clone/core-player/Rules/Added';

describe(`City.yield`, (): void => {
  const ruleRegistry = new RuleRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    wonderRegistry = new WonderRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    availableBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    advanceRegistry = new AdvanceRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry();

  ruleRegistry.register(
    ...grow(cityGrowthRegistry),
    ...cityYield(cityImprovementRegistry, playerGovernmentRegistry),
    ...wonderCityYield(playerResearchRegistry, wonderRegistry),
    new TileYield(new Effect(() => new Trade(1))),
    new Added(
      new Effect((player) =>
        playerGovernmentRegistry.register(new PlayerGovernment(player))
      )
    )
  );

  it('should provide one additional trade per Tile with trade already on in the city until the discovery of Electricity', async (): Promise<void> => {
    const city = await setUpCity({
      ruleRegistry,
      size: 5,
      tileImprovementRegistry,
      cityGrowthRegistry,
    });

    playerResearchRegistry.register(new PlayerResearch(city.player()));

    expect(reduceYield(city.yields(), Trade)).equal(6);

    wonderRegistry.register(new Colossus(city, ruleRegistry));

    expect(reduceYield(city.yields(), Trade)).equal(12);

    playerResearchRegistry.getByPlayer(city.player()).addAdvance(Electricity);

    expect(reduceYield(city.yields(), Trade)).equal(6);
  });

  (
    [
      [HangingGardens, 1, Invention],
      [CureForCancer, 1, null],
    ] as [typeof Wonder, number, typeof Advance | null][]
  ).forEach(([WonderType, expectedHappiness, ObsoletingAdvance]) => {
    it(`should provide ${expectedHappiness} additional Happiness in all cites owned by the Player that has the ${
      WonderType.name
    }${
      ObsoletingAdvance
        ? ' until the discovery of ' + ObsoletingAdvance.name
        : ''
    }`, async (): Promise<void> => {
      const [city, friendlyCity, enemyCity] = await setUpCities(
          ruleRegistry,
          playerWorldRegistry,
          availableBuildItemsRegistry,
          advanceRegistry,
          cityBuildRegistry,
          playerResearchRegistry
        ),
        playerResearch = playerResearchRegistry.getByPlayer(city.player());

      expect(reduceYield(city.yields(), Happiness)).equal(0);
      expect(reduceYield(friendlyCity.yields(), Happiness)).equal(0);
      expect(reduceYield(enemyCity.yields(), Happiness)).equal(0);

      wonderRegistry.register(new WonderType(city, ruleRegistry));

      expect(reduceYield(city.yields(), Happiness)).equal(1);
      expect(reduceYield(friendlyCity.yields(), Happiness)).equal(1);
      expect(reduceYield(enemyCity.yields(), Happiness)).equal(0);

      city.capture(enemyCity.player());

      expect(reduceYield(city.yields(), Happiness)).equal(1);
      expect(reduceYield(friendlyCity.yields(), Happiness)).equal(0);
      expect(reduceYield(enemyCity.yields(), Happiness)).equal(1);

      if (ObsoletingAdvance !== null) {
        playerResearch.addAdvance(Invention);

        expect(reduceYield(city.yields(), Happiness)).equal(0);
        expect(reduceYield(friendlyCity.yields(), Happiness)).equal(0);
        expect(reduceYield(enemyCity.yields(), Happiness)).equal(0);
      }
    });
  });
});
