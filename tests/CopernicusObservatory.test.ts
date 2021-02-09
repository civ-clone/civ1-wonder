import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { CopernicusObservatory } from '../Wonders';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { Research } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import cityYield from '../Rules/City/yield';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('CopernicusObservatory', (): void => {
  it('should double the Research production in the city', (): void => {
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

    const city = setUpCity({
      ruleRegistry,
    });

    city.tile().yields = (): void => [new Research(5)];

    const [researchYield] = city.yields([Research]);

    expect(researchYield.value()).to.equal(5);

    wonderRegistry.register(
      new CopernicusObservatory(city.player(), city, ruleRegistry)
    );

    const [updatedResearchYield] = city.yields([Research]);

    expect(updatedResearchYield.value()).to.equal(10);
  });
});
