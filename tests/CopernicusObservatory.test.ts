import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { CopernicusObservatory } from '../Wonders';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { Research } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import cityYield from '../Rules/City/yield';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

describe('CopernicusObservatory', (): void => {
  it('should double the Research production in the city', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry();

    ruleRegistry.register(
      ...cityYield(
        cityImprovementRegistry,
        playerResearchRegistry,
        wonderRegistry
      )
    );

    const city = await setUpCity({
      ruleRegistry,
    });

    playerResearchRegistry.register(new PlayerResearch(city.player()));

    city.tile().yields = (): Yield[] => [new Research(5)];

    const [researchYield] = city.yields([Research]);

    expect(researchYield.value()).to.equal(5);

    wonderRegistry.register(
      new CopernicusObservatory(city.player(), city, ruleRegistry)
    );

    const [updatedResearchYield] = city.yields([Research]);

    expect(updatedResearchYield.value()).to.equal(10);
  });
});
