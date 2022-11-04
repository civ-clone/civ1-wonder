import { CopernicusObservatory, SetiProgram } from '../Wonders';
import Advance from '@civ-clone/core-science/Advance';
import { Automobile } from '@civ-clone/civ1-science/Advances';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { Research } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import cityYieldModifier from '../Rules/City/yield-modifier';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('Wonder.yield-modifier', () => {
  const playerWorldRegistry = new PlayerWorldRegistry(),
    wonderRegistry = new WonderRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry();

  (
    [[CopernicusObservatory, 1, Research, Automobile]] as [
      typeof Wonder,
      number,
      typeof Yield,
      typeof Advance | null
    ][]
  ).forEach(([WonderType, multiplier, YieldType, ObsoletingAdvance]) =>
    it(`should increase the ${YieldType.name} in the city by ${
      multiplier * 100
    }% when ${WonderType.name} exists`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry();

      ruleRegistry.register(
        ...cityYieldModifier(playerResearchRegistry, wonderRegistry),
        new CityYield(new Effect(() => new YieldType(5)))
      );

      const city = await setUpCity({
        ruleRegistry,
        playerWorldRegistry,
      });

      playerResearchRegistry.register(new PlayerResearch(city.player()));

      const yieldValue = city
        .yields()
        .filter((cityYield) => cityYield instanceof YieldType)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(yieldValue).to.equal(5);

      wonderRegistry.register(new WonderType(city, ruleRegistry));

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
    })
  );

  (
    [[SetiProgram, 0.5, Research, null]] as [
      typeof Wonder,
      number,
      typeof Yield,
      typeof Advance | null
    ][]
  ).forEach(([WonderType, multiplier, YieldType, ObsoletingAdvance]) =>
    it(`should increase the ${YieldType.name} in every city by ${
      multiplier * 100
    }% when ${WonderType.name} exists`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry();

      ruleRegistry.register(
        ...cityYieldModifier(playerResearchRegistry, wonderRegistry),
        new CityYield(new Effect(() => new YieldType(5)))
      );

      const city = await setUpCity({
          ruleRegistry,
          playerWorldRegistry,
        }),
        city2 = await setUpCity({
          player: city.player(),
          tile: city.tile().getNeighbour('e'),
          world: city.tile().map(),
          ruleRegistry,
          playerWorldRegistry,
        });

      playerResearchRegistry.register(new PlayerResearch(city.player()));

      const cityYield = city
          .yields()
          .filter((cityYield) => cityYield instanceof YieldType)
          .reduce((total, cityYield) => total + cityYield.value(), 0),
        city2Yield = city2
          .yields()
          .filter((cityYield) => cityYield instanceof YieldType)
          .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(cityYield).to.equal(5);
      expect(city2Yield).to.equal(5);

      wonderRegistry.register(new WonderType(city, ruleRegistry));

      const updatedCityYield = city
          .yields()
          .filter((cityYield) => cityYield instanceof YieldType)
          .reduce((total, cityYield) => total + cityYield.value(), 0),
        updatedCity2Yield = city2
          .yields()
          .filter((cityYield) => cityYield instanceof YieldType)
          .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(updatedCityYield).to.equal(5 + 5 * multiplier);
      expect(updatedCity2Yield).to.equal(5 + 5 * multiplier);

      if (ObsoletingAdvance !== null) {
        const playerResearch = playerResearchRegistry.getByPlayer(
          city.player()
        );

        playerResearch.addAdvance(ObsoletingAdvance);

        const updatedCityYieldObsolete = city
            .yields()
            .filter((cityYield) => cityYield instanceof YieldType)
            .reduce((total, cityYield) => total + cityYield.value(), 0),
          updatedCity2YieldObsolete = city
            .yields()
            .filter((cityYield) => cityYield instanceof YieldType)
            .reduce((total, cityYield) => total + cityYield.value(), 0);

        expect(updatedCityYieldObsolete).to.equal(5);
        expect(updatedCity2YieldObsolete).to.equal(5);
      }
    })
  );
});
