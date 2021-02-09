import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Mysticism } from '@civ-clone/civ1-science/Advances';
import { Oracle } from '../Wonders';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Temple } from '@civ-clone/civ1-city-improvement/CityImprovements';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { Unhappiness } from '@civ-clone/civ1-city/Yields';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import cityHappinessYield from '@civ-clone/civ1-city-happiness/Rules/City/yield';
import cityImprovementYield from '@civ-clone/civ1-city-improvement/Rules/City/yield';
import cityYield from '../Rules/City/yield';
import cost from '@civ-clone/civ1-city-improvement/Rules/City/cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('Oracle', (): void => {
  it('should reduce Unhappiness by two in a city with a temple', (): void => {
    const ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      cityGrowthRegistry = new CityGrowthRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      city = setUpCity({
        cityGrowthRegistry,
        ruleRegistry,
        size: 9,
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
      ...cityYield(
        cityImprovementRegistry,
        playerResearchRegistry,
        wonderRegistry
      ),
      ...cityHappinessYield(
        ruleRegistry,
        cityGrowthRegistry,
        cityImprovementRegistry,
        playerResearchRegistry
      ),
      ...cityImprovementYield(cityImprovementRegistry),
      ...cost(cityImprovementRegistry)
    );

    playerResearchRegistry.register(playerResearch);

    ([
      [(): void => {}, 4],
      [
        (): void => {
          cityImprovementRegistry.register(
            new Temple(city.player(), city, ruleRegistry)
          );
        },
        3,
      ],
      [
        (): void => {
          wonderRegistry.register(
            new Oracle(city.player(), city, ruleRegistry)
          );
        },
        2,
      ],
      [
        (): void => {
          playerResearch.addAdvance(Mysticism);
        },
        0,
      ],
    ] as [() => void, number][]).forEach(([action, value]) => {
      action();

      const [unhappinessYield] = city.yields([Unhappiness]);

      expect(unhappinessYield.value()).to.equal(value);
    });
  });
});
