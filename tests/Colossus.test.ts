import City from '@civ-clone/core-city/City';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import { Colossus } from '../Wonders';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import TileYield from '@civ-clone/core-world/Rules/Yield';
import { Trade } from '@civ-clone/civ1-city/Yields';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import wonderCityYield from '../Rules/City/yield';
import cityYield from '@civ-clone/civ1-city/Rules/City/yield';
import { expect } from 'chai';
import grow from '@civ-clone/civ1-city/Rules/City/grow';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('Colossus', (): void => {
  it('should provide one additional trade per tile with trade already on in the city that builds it', async (): Promise<void> => {
    const cityGrowthRegistry = new CityGrowthRegistry(),
      playerGovernmentRegistry = new PlayerGovernmentRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      ruleRegistry = new RuleRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      wonderRegistry = new WonderRegistry();

    ruleRegistry.register(
      ...grow(cityGrowthRegistry),
      ...cityYield(cityGrowthRegistry, playerGovernmentRegistry),
      ...wonderCityYield(playerResearchRegistry, wonderRegistry),
      new TileYield(new Effect(() => new Trade(1)))
    );

    const city = await setUpCity({
      ruleRegistry,
      size: 5,
      tileImprovementRegistry,
      cityGrowthRegistry,
    });

    playerGovernmentRegistry.register(new PlayerGovernment(city.player()));
    playerResearchRegistry.register(new PlayerResearch(city.player()));

    const tradeYield = city
      .yields()
      .filter((cityYield) => cityYield instanceof Trade)
      .reduce((total, cityYield) => total + cityYield.value(), 0);

    expect(tradeYield).to.equal(6);

    wonderRegistry.register(new Colossus(city.player(), city, ruleRegistry));

    const updatedTradeYield = city
      .yields()
      .filter((cityYield) => cityYield instanceof Trade)
      .reduce((total, cityYield) => total + cityYield.value(), 0);

    expect(updatedTradeYield).to.equal(12);
  });
});
