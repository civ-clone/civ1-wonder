import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Mysticism } from '@civ-clone/civ1-science/Advances';
import { Oracle } from '../Wonders';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Temple } from '@civ-clone/civ1-city-improvement/CityImprovements';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { Unhappiness } from '@civ-clone/civ1-city/Yields';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import { expect } from 'chai';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import wonderCityCost from '../Rules/City/cost';
import wonderCityYield from '../Rules/City/yield';
import Yield from '@civ-clone/core-city/Rules/Yield';
import Effect from '@civ-clone/core-rule/Effect';

describe('Oracle', (): void => {
  it('should reduce Unhappiness by two in a city with a temple', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      cityGrowthRegistry = new CityGrowthRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      city = await setUpCity({
        cityGrowthRegistry,
        ruleRegistry,
        size: 1,
        tileImprovementRegistry,
      }),
      unitRegistry = new UnitRegistry(),
      advanceRegistry = new AdvanceRegistry(),
      playerGovernmentRegistry = new PlayerGovernmentRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      playerResearch = new PlayerResearch(
        city.player(),
        advanceRegistry,
        ruleRegistry
      );

    ruleRegistry.register(
      ...wonderCityYield(playerResearchRegistry, wonderRegistry),
      ...wonderCityCost(
        cityImprovementRegistry,
        playerGovernmentRegistry,
        playerResearchRegistry,
        unitRegistry,
        wonderRegistry
      ),
      new Yield(new Effect(() => new Unhappiness(4)))
    );

    playerGovernmentRegistry.register(new PlayerGovernment(city.player()));
    playerResearchRegistry.register(playerResearch);

    cityImprovementRegistry.register(
      new Temple(city.player(), city, ruleRegistry)
    );

    (
      [
        [(): void => {}, 4],
        [
          (): void => {
            wonderRegistry.register(
              new Oracle(city.player(), city, ruleRegistry)
            );
          },
          3,
        ],
        [
          (): void => {
            playerResearch.addAdvance(Mysticism);
          },
          2,
        ],
      ] as [() => void, number][]
    ).forEach(([action, value]) => {
      action();

      expect(reduceYield(city.yields(), Unhappiness)).to.equal(value);
    });
  });
});
