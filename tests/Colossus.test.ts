import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Colossus } from '../Wonders';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { Trade } from '@civ-clone/civ1-city/Yields';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import cityYield from '../Rules/City/yield';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import tileYield from '@civ-clone/civ1-world/Rules/Tile/yield';

describe('Colossus', (): void => {
  it('should provide one additional trade per tile with trade already on in the city that builds it', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry();

    ruleRegistry.register(
      ...cityYield(
        cityImprovementRegistry,
        playerResearchRegistry,
        wonderRegistry
      ),
      ...tileYield(tileImprovementRegistry)
    );

    const city = await setUpCity({
      ruleRegistry,
      size: 5,
      tileImprovementRegistry,
    });

    city.tile().yields = (): Yield[] => [new Trade(6)];

    const [tradeYield] = city.yields([Trade]);

    expect(tradeYield.value()).to.equal(6);

    wonderRegistry.register(new Colossus(city.player(), city, ruleRegistry));

    const [updatedTradeYield] = city.yields([Trade]);

    expect(updatedTradeYield.value()).to.equal(12);
  });
});
