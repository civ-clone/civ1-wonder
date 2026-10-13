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
import Effect from '@civ-clone/core-rule/Effect';
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

    it("should raise a Library from +50% to +83% Research in every one of its Player's cities, until Nuclear Fission", async (): Promise<void> => {
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

      // floor(12 × 2/9) = 2
      expect(reduceYield(city.yields(), Research)).equal(14);
      expect(reduceYield(friendlyCity.yields(), Research)).equal(14);
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

      // 18 + floor(18 × 2/9) = 22, then 22 + floor(22 × 2/9) = 26.
      expect(reduceYield(city.yields(), Research)).equal(26);
      expect(reduceYield(friendlyCity.yields(), Research)).equal(22);
    });

    it("should give Library and Isaac Newton's College the 1.83× of v474.05 with a lone Library", async (): Promise<void> => {
      const { cityImprovementRegistry, ruleRegistry, wonderRegistry, city } =
        await setUp(Research, 18);

      // civ1-city-improvement's Library, written here to keep this package's
      // dependencies as they are.
      ruleRegistry.register(
        new YieldModifier(
          new Effect(
            (city: City, yields: Yield[]): Yield =>
              new Research(
                cityImprovementRegistry
                  .getByCity(city)
                  .some((improvement) => improvement instanceof Library)
                  ? Math.floor(reduceYield(yields, Research) * 0.5)
                  : 0,
                Library.name
              )
          )
        )
      );

      build(cityImprovementRegistry, ruleRegistry, city, Library);
      wonderRegistry.register(new IsaacNewtonsCollege(city, ruleRegistry));

      // v474.05: 18 + 18/2 + 18/3 = 33. Newton's runs first here, as in a real
      // game (civ1-wonder registers before civ1-city-improvement): 18 + 4 =
      // 22, then 22 + 11. The other order gives 18 + 9 = 27, then 27 + 6.
      expect(reduceYield(city.yields(), Research)).equal(33);
    });

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
