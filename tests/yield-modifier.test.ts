// Must come first: what makes a Wonder obsolete is read from the game's requirements.
import './lib/requirements';

import { Automobile, NuclearFission } from '@civ-clone/civ1-science/Advances';
import {
  CopernicusObservatory,
  HooverDam,
  IsaacNewtonsCollege,
  SetiProgram,
} from '../Wonders';
import {
  Factory,
  Library,
  PowerPlant,
  University,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import { Production, Research } from '@civ-clone/civ1-city/Yields';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import LandMass from '@civ-clone/core-world/LandMass';
import LandMassRegistry from '@civ-clone/core-world/LandMassRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
import cityYieldModifier from '../Rules/City/yield-modifier';
import { expect } from 'chai';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
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

      expect(updatedCityYield).to.equal(5 + Math.floor(5 * multiplier));
      expect(updatedCity2Yield).to.equal(5 + Math.floor(5 * multiplier));

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

  describe('IsaacNewtonsCollege and HooverDam', (): void => {
    const setUp = async (
      YieldType: typeof Yield,
      value: number
    ): Promise<{
      cityImprovementRegistry: CityImprovementRegistry;
      landMassRegistry: LandMassRegistry;
      playerResearchRegistry: PlayerResearchRegistry;
      ruleRegistry: RuleRegistry;
      wonderRegistry: WonderRegistry;
      city: City;
      friendlyCity: City;
      enemyCity: City;
    }> => {
      const ruleRegistry = new RuleRegistry(),
        cityImprovementRegistry = new CityImprovementRegistry(),
        landMassRegistry = new LandMassRegistry(),
        playerResearchRegistry = new PlayerResearchRegistry(),
        wonderRegistry = new WonderRegistry(),
        playerWorldRegistry = new PlayerWorldRegistry();

      ruleRegistry.register(
        ...cityYieldModifier(
          playerResearchRegistry,
          wonderRegistry,
          cityImprovementRegistry,
          landMassRegistry
        ),
        new CityYield(new Effect(() => new YieldType(value)))
      );

      const city = await setUpCity({
          ruleRegistry,
          playerWorldRegistry,
        }),
        friendlyCity = await setUpCity({
          player: city.player(),
          tile: city.tile().getNeighbour('e'),
          world: city.tile().map(),
          ruleRegistry,
          playerWorldRegistry,
        }),
        enemyCity = await setUpCity({
          tile: city.tile().getNeighbour('w'),
          world: city.tile().map(),
          ruleRegistry,
          playerWorldRegistry,
        });

      playerResearchRegistry.register(
        new PlayerResearch(city.player()),
        new PlayerResearch(enemyCity.player())
      );

      return {
        cityImprovementRegistry,
        landMassRegistry,
        playerResearchRegistry,
        ruleRegistry,
        wonderRegistry,
        city,
        friendlyCity,
        enemyCity,
      };
    };

    const build = (
      cityImprovementRegistry: CityImprovementRegistry,
      ruleRegistry: RuleRegistry,
      city: City,
      ...Improvements: (typeof CityImprovement)[]
    ): void =>
      cityImprovementRegistry.register(
        ...Improvements.map(
          (Improvement) => new Improvement(city, ruleRegistry)
        )
      );

    it("should add a third of the base Research for a Library in every one of its Player's cities, until Nuclear Fission", async (): Promise<void> => {
      const {
        cityImprovementRegistry,
        playerResearchRegistry,
        ruleRegistry,
        wonderRegistry,
        city,
        friendlyCity,
        enemyCity,
      } = await setUp(Research, 12);

      [city, friendlyCity, enemyCity].forEach((city) =>
        build(cityImprovementRegistry, ruleRegistry, city, Library)
      );

      // The Library's own +50% comes from civ1-city-improvement, not
      // registered here, so these are the base 12 and Newton's share of it.
      expect(reduceYield(city.yields(), Research)).equal(12);

      wonderRegistry.register(new IsaacNewtonsCollege(city, ruleRegistry));

      // 12 + floor(12 / 3)
      expect(reduceYield(city.yields(), Research)).equal(16);
      expect(reduceYield(friendlyCity.yields(), Research)).equal(16);
      expect(reduceYield(enemyCity.yields(), Research)).equal(12);

      playerResearchRegistry
        .getByPlayer(enemyCity.player())
        .addAdvance(NuclearFission);

      expect(reduceYield(city.yields(), Research)).equal(12);
    });

    it('should apply once each for a Library and a University, and not at all without either', async (): Promise<void> => {
      const {
        cityImprovementRegistry,
        ruleRegistry,
        wonderRegistry,
        city,
        friendlyCity,
      } = await setUp(Research, 18);

      wonderRegistry.register(new IsaacNewtonsCollege(city, ruleRegistry));

      expect(reduceYield(city.yields(), Research)).equal(18);

      build(cityImprovementRegistry, ruleRegistry, city, Library, University);
      build(cityImprovementRegistry, ruleRegistry, friendlyCity, University);

      // 18 + 2 × floor(18 / 3) = 30 with both, and 18 + 6 = 24 with only a
      // University.
      expect(reduceYield(city.yields(), Research)).equal(30);
      expect(reduceYield(friendlyCity.yields(), Research)).equal(24);
    });

    // civ1-city-improvement's Library and University (`Low`, +50% of the
    // base), written here to keep this package's dependencies as they are.
    const improvementRules = (
      cityImprovementRegistry: CityImprovementRegistry
    ): YieldModifier[] =>
      [Library, University].map(
        (Improvement) =>
          new YieldModifier(
            new Low(),
            new Criterion((city: City): boolean =>
              cityImprovementRegistry
                .getByCity(city)
                .some((improvement) => improvement instanceof Improvement)
            ),
            new Effect(
              (city: City, yields: Yield[], base: Yield[]): Yield =>
                new Research(
                  Math.floor(reduceYield(base, Research) / 2),
                  Improvement.name
                )
            )
          )
      );

    (
      [
        ['after', false],
        ['before', true],
      ] as [string, boolean][]
    ).forEach(([order, improvementsFirst]) =>
      (
        [
          // As v474.05: 12 + 12/2 + 12/3 = 22.
          [[Library], 22, false],
          // 12 + 2 × (12/2 + 12/3) = 32.
          [[Library, University], 32, false],
          // Copernicus doubles that, whichever order the rules register in.
          [[Library, University], 64, true],
        ] as [(typeof CityImprovement)[], number, boolean][]
      ).forEach(([Improvements, expected, copernicus]) =>
        it(`should give ${expected} Research from a base of 12 with ${Improvements.map(
          (Improvement) => Improvement.name
        ).join(' and ')}${
          copernicus ? ' and CopernicusObservatory' : ''
        } when civ1-city-improvement's rules register ${order} this package's`, async (): Promise<void> => {
          const cityImprovementRegistry = new CityImprovementRegistry(),
            playerResearchRegistry = new PlayerResearchRegistry(),
            wonderRegistry = new WonderRegistry(),
            ruleRegistry = new RuleRegistry(),
            wonderRules = cityYieldModifier(
              playerResearchRegistry,
              wonderRegistry,
              cityImprovementRegistry
            );

          ruleRegistry.register(
            ...(improvementsFirst
              ? [...improvementRules(cityImprovementRegistry), ...wonderRules]
              : [...wonderRules, ...improvementRules(cityImprovementRegistry)]),
            new CityYield(new Effect(() => new Research(12)))
          );

          const city = await setUpCity({
            ruleRegistry,
            playerWorldRegistry: new PlayerWorldRegistry(),
          });

          playerResearchRegistry.register(new PlayerResearch(city.player()));

          build(cityImprovementRegistry, ruleRegistry, city, ...Improvements);
          wonderRegistry.register(new IsaacNewtonsCollege(city, ruleRegistry));

          if (copernicus) {
            wonderRegistry.register(
              new CopernicusObservatory(city, ruleRegistry)
            );
          }

          expect(reduceYield(city.yields(), Research)).equal(expected);
        })
      )
    );

    it("should give +50% Production to its Player's cities with a Factory on its continent", async (): Promise<void> => {
      const {
        cityImprovementRegistry,
        landMassRegistry,
        ruleRegistry,
        wonderRegistry,
        city,
        friendlyCity,
        enemyCity,
      } = await setUp(Production, 10);

      landMassRegistry.register(
        new LandMass([city.tile(), friendlyCity.tile(), enemyCity.tile()])
      );

      [city, friendlyCity, enemyCity].forEach((city) =>
        build(cityImprovementRegistry, ruleRegistry, city, Factory)
      );

      wonderRegistry.register(new HooverDam(city, ruleRegistry));

      expect(reduceYield(city.yields(), Production)).equal(15);
      expect(reduceYield(friendlyCity.yields(), Production)).equal(15);
      expect(reduceYield(enemyCity.yields(), Production)).equal(10);
    });

    it('should not give Production on another continent, without a Factory, or alongside a plant', async (): Promise<void> => {
      const {
        cityImprovementRegistry,
        landMassRegistry,
        ruleRegistry,
        wonderRegistry,
        city,
        friendlyCity,
      } = await setUp(Production, 10);

      const thirdCity = await setUpCity({
        player: city.player(),
        tile: city.tile().getNeighbour('s'),
        world: city.tile().map(),
        ruleRegistry,
      });

      landMassRegistry.register(
        new LandMass([city.tile(), thirdCity.tile()]),
        new LandMass([friendlyCity.tile()])
      );

      wonderRegistry.register(new HooverDam(city, ruleRegistry));

      // No Factory yet.
      expect(reduceYield(city.yields(), Production)).equal(10);

      build(cityImprovementRegistry, ruleRegistry, friendlyCity, Factory);
      build(
        cityImprovementRegistry,
        ruleRegistry,
        thirdCity,
        Factory,
        PowerPlant
      );

      expect(reduceYield(friendlyCity.yields(), Production)).equal(10);
      expect(reduceYield(thirdCity.yields(), Production)).equal(10);
    });
  });
});
