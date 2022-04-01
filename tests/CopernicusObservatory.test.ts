import CityYield from '@civ-clone/core-city/Rules/Yield';
import { CopernicusObservatory, SetiProgram } from '../Wonders';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { Research } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import cityYieldModifier from '../Rules/City/yield-modifier';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import { Automobile } from '@civ-clone/civ1-science/Advances';
import Advance from '@civ-clone/core-science/Advance';

(
  [
    [CopernicusObservatory, 1, Research, Automobile],
    [SetiProgram, 0.5, Research, null],
  ] as [typeof Wonder, number, typeof Yield, typeof Advance | null][]
).forEach(([WonderType, multiplier, YieldType, ObsoletingAdvance]) =>
  describe(WonderType.name, (): void => {
    it(`should increase the ${YieldType.name} in the city by ${
      multiplier * 100
    }%`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        wonderRegistry = new WonderRegistry(),
        playerResearchRegistry = new PlayerResearchRegistry();

      ruleRegistry.register(
        ...cityYieldModifier(playerResearchRegistry, wonderRegistry),
        new CityYield(new Effect(() => new YieldType(5)))
      );

      const city = await setUpCity({
        ruleRegistry,
      });

      playerResearchRegistry.register(new PlayerResearch(city.player()));

      const yieldValue = city
        .yields()
        .filter((cityYield) => cityYield instanceof YieldType)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(yieldValue).to.equal(5);

      wonderRegistry.register(
        new WonderType(city.player(), city, ruleRegistry)
      );

      const updatedYield = city
        .yields()
        .filter((cityYield) => cityYield instanceof YieldType)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(updatedYield).to.equal(5 + 5 * multiplier);

      if (ObsoletingAdvance !== null) {
        const playerResearch = playerResearchRegistry.getByPlayer(
          city.player()
        );

        playerResearch.addAdvance(ObsoletingAdvance);

        const updatedYield = city
          .yields()
          .filter((cityYield) => cityYield instanceof YieldType)
          .reduce((total, cityYield) => total + cityYield.value(), 0);

        expect(updatedYield).to.equal(5);
      }
    });
  })
);
