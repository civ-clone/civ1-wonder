import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { CureForCancer, HangingGardens } from '../Wonders';
import { Happiness } from '@civ-clone/civ1-city/Yields';
import { Invention } from '@civ-clone/civ1-science/Advances';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import cityYield from '../Rules/City/yield';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Yield from '@civ-clone/core-yield/Yield';
import Wonder from '@civ-clone/core-wonder/Wonder';

(
  [
    [HangingGardens, 1],
    [CureForCancer, 1],
  ] as [typeof Wonder, number][]
).forEach(([WonderType, expectedHappiness]) =>
  describe(WonderType.name, (): void => {
    it(`should provide ${expectedHappiness} additional Happiness in the city`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        wonderRegistry = new WonderRegistry(),
        tileImprovementRegistry = new TileImprovementRegistry(),
        city = await setUpCity({
          ruleRegistry,
          size: 5,
          tileImprovementRegistry,
        }),
        advanceRegistry = new AdvanceRegistry(),
        playerResearchRegistry = new PlayerResearchRegistry(),
        playerResearch = new PlayerResearch(
          city.player(),
          advanceRegistry,
          ruleRegistry
        );

      ruleRegistry.register(
        ...cityYield(playerResearchRegistry, wonderRegistry)
      );
      playerResearchRegistry.register(playerResearch);

      const happinessYield = city
        .yields()
        .filter((cityYield) => cityYield instanceof Happiness)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(happinessYield).to.equal(0);

      wonderRegistry.register(
        new HangingGardens(city.player(), city, ruleRegistry)
      );

      const updatedHappinessYield = city
        .yields()
        .filter((cityYield) => cityYield instanceof Happiness)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(updatedHappinessYield).to.equal(1);
    });

    it('should not provide one additional Happiness in the city once Invention is discovered', async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        playerResearchRegistry = new PlayerResearchRegistry(),
        wonderRegistry = new WonderRegistry(),
        tileImprovementRegistry = new TileImprovementRegistry(),
        advanceRegistry = new AdvanceRegistry(),
        city = await setUpCity({
          ruleRegistry,
          size: 5,
          tileImprovementRegistry,
        }),
        playerResearch = new PlayerResearch(
          city.player(),
          advanceRegistry,
          ruleRegistry
        );

      ruleRegistry.register(
        ...cityYield(playerResearchRegistry, wonderRegistry)
      );

      playerResearchRegistry.register(playerResearch);

      wonderRegistry.register(
        new HangingGardens(city.player(), city, ruleRegistry)
      );

      const happinessYield = city
        .yields()
        .filter((cityYield) => cityYield instanceof Happiness)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(happinessYield).to.equal(1);

      playerResearch.addAdvance(Invention);

      const updatedHappinessYield = city
        .yields()
        .filter((cityYield) => cityYield instanceof Happiness)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(updatedHappinessYield).to.equal(0);
    });

    it('should provide one additional Happiness in all cities the building player owns', async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        wonderRegistry = new WonderRegistry(),
        tileImprovementRegistry = new TileImprovementRegistry(),
        city = await setUpCity({
          ruleRegistry,
          size: 5,
          tileImprovementRegistry,
        }),
        advanceRegistry = new AdvanceRegistry(),
        playerResearchRegistry = new PlayerResearchRegistry(),
        playerResearch = new PlayerResearch(
          city.player(),
          advanceRegistry,
          ruleRegistry
        );

      ruleRegistry.register(
        ...cityYield(playerResearchRegistry, wonderRegistry)
      );
      playerResearchRegistry.register(playerResearch);

      const happinessYield = city
        .yields()
        .filter((cityYield) => cityYield instanceof Happiness)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(happinessYield).to.equal(0);

      wonderRegistry.register(
        new HangingGardens(city.player(), city, ruleRegistry)
      );

      const updatedHappinessYield = city
        .yields()
        .filter((cityYield) => cityYield instanceof Happiness)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(updatedHappinessYield).to.equal(1);
    });
  })
);
