import {
  ApolloProgram,
  Colossus,
  CopernicusObservatory,
  CureForCancer,
  DarwinsVoyage,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  HooverDam,
  IsaacNewtonsCollege,
  JsBachsCathedral,
  Lighthouse,
  MagellansExpedition,
  ManhattanProject,
  MichelangelosChapel,
  Oracle,
  Pyramids,
  SetiProgram,
  ShakespearesTheatre,
  UnitedNations,
  WomensSuffrage,
} from '../Wonders';
import {
  Astronomy,
  BronzeWorking,
  CeremonialBurial,
  Communism,
  Computers,
  Electronics,
  GeneticEngineering,
  Industrialization,
  Literacy,
  MapMaking,
  Masonry,
  Medicine,
  Mysticism,
  Navigation,
  NuclearFission,
  Pottery,
  Railroad,
  Religion,
  SpaceFlight,
  TheoryOfGravity,
} from '@civ-clone/civ1-science/Advances';
import {
  Cathedral,
  Temple,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  Chariot,
  Horseman,
  Spearman,
  Warrior,
} from '@civ-clone/civ1-unit/Units';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import AvailableGovernmentRegistry from '@civ-clone/core-government/AvailableGovernmentRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Effect from '@civ-clone/core-rule/Effect';
import { MilitaryUnhappiness } from '@civ-clone/civ1-city-happiness/Yields';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Unhappiness } from '@civ-clone/civ1-city/Yields';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Yield from '@civ-clone/core-city/Rules/Yield';
import YieldValue from '@civ-clone/core-yield/Yield';
import cityCost from '../Rules/City/cost';
import cityCostHappiness from '@civ-clone/civ1-city-happiness/Rules/City/cost';
import { expect } from 'chai';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
import researchComplete from '../Rules/Player/research-complete';
import setUpCities from './lib/setUpCities';

describe('City.cost', (): void => {
  const ruleRegistry = new RuleRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    wonderRegistry = new WonderRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    availableBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    advanceRegistry = new AdvanceRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    unitRegistry = new UnitRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    availableGovernmentRegistry = new AvailableGovernmentRegistry();

  ruleRegistry.register(
    ...cityCost(
      cityImprovementRegistry,
      playerGovernmentRegistry,
      playerResearchRegistry,
      unitRegistry,
      wonderRegistry
    ),
    ...cityCostHappiness(
      ruleRegistry,
      cityGrowthRegistry,
      cityImprovementRegistry,
      playerGovernmentRegistry,
      playerResearchRegistry,
      unitRegistry
    ),
    ...researchComplete(playerResearchRegistry, ruleRegistry, wonderRegistry)
  );

  availableBuildItemsRegistry.register(
    ApolloProgram as unknown as typeof Buildable,
    Colossus as unknown as typeof Buildable,
    CopernicusObservatory as unknown as typeof Buildable,
    CureForCancer as unknown as typeof Buildable,
    DarwinsVoyage as unknown as typeof Buildable,
    GreatLibrary as unknown as typeof Buildable,
    GreatWall as unknown as typeof Buildable,
    HangingGardens as unknown as typeof Buildable,
    HooverDam as unknown as typeof Buildable,
    IsaacNewtonsCollege as unknown as typeof Buildable,
    JsBachsCathedral as unknown as typeof Buildable,
    Lighthouse as unknown as typeof Buildable,
    MagellansExpedition as unknown as typeof Buildable,
    ManhattanProject as unknown as typeof Buildable,
    MichelangelosChapel as unknown as typeof Buildable,
    Oracle as unknown as typeof Buildable,
    Pyramids as unknown as typeof Buildable,
    SetiProgram as unknown as typeof Buildable,
    ShakespearesTheatre as unknown as typeof Buildable,
    UnitedNations as unknown as typeof Buildable,
    WomensSuffrage as unknown as typeof Buildable
  );

  advanceRegistry.register(
    Astronomy,
    BronzeWorking,
    CeremonialBurial,
    Communism,
    Computers,
    Electronics,
    GeneticEngineering,
    Industrialization,
    Literacy,
    MapMaking,
    Masonry,
    Medicine,
    Navigation,
    NuclearFission,
    Pottery,
    Railroad,
    Religion,
    SpaceFlight,
    TheoryOfGravity
  );

  (
    [
      [Temple, Oracle, 1],
      [Temple, Oracle, 2, Mysticism],
      [Cathedral, MichelangelosChapel, 4],
    ] as [typeof CityImprovement, typeof Wonder, number, typeof Advance?][]
  ).forEach(
    ([CityImprovementType, WonderType, expectedIncrease, AdvanceType]) =>
      it(`should increase the effectiveness of the ${
        CityImprovementType.name
      } by ${expectedIncrease} when ${
        WonderType.name
      } exists in a Player's City${
        AdvanceType ? ' and the Player has discovered ' + AdvanceType.name : ''
      }`, async (): Promise<void> => {
        const [city, friendlyCity, enemyCity] = await setUpCities(
          ruleRegistry,
          playerWorldRegistry,
          availableBuildItemsRegistry,
          advanceRegistry,
          cityBuildRegistry,
          playerResearchRegistry,
          playerGovernmentRegistry,
          availableGovernmentRegistry
        );

        const unhappiness = new Yield(new Effect(() => new Unhappiness(10)));

        ruleRegistry.register(unhappiness);

        expect(reduceYield(city.yields(), Unhappiness)).equal(10);
        expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(10);
        expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(10);

        cityImprovementRegistry.register(
          ...[city, friendlyCity, enemyCity].map(
            (city) => new CityImprovementType(city, ruleRegistry)
          )
        );

        if (AdvanceType) {
          playerResearchRegistry
            .getByPlayer(city.player())
            .addAdvance(AdvanceType);
          playerResearchRegistry
            .getByPlayer(enemyCity.player())
            .addAdvance(AdvanceType);
        }

        expect(reduceYield(city.yields(), Unhappiness)).equal(
          10 - expectedIncrease
        );
        expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(
          10 - expectedIncrease
        );
        expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(
          10 - expectedIncrease
        );

        wonderRegistry.register(new WonderType(city, ruleRegistry));

        expect(reduceYield(city.yields(), Unhappiness)).equal(
          10 - 2 * expectedIncrease
        );
        expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(
          10 - 2 * expectedIncrease
        );
        expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(
          10 - expectedIncrease
        );

        ruleRegistry.unregister(unhappiness);
      })
  );

  it('should reduce unhappiness by 2 in all Player cities when the Player has JsBachsCathedral', async (): Promise<void> => {
    const [city, friendlyCity, enemyCity] = await setUpCities(
      ruleRegistry,
      playerWorldRegistry,
      availableBuildItemsRegistry,
      advanceRegistry,
      cityBuildRegistry,
      playerResearchRegistry,
      playerGovernmentRegistry,
      availableGovernmentRegistry
    );

    const unhappiness = new Yield(new Effect(() => new Unhappiness(10)));

    ruleRegistry.register(unhappiness);

    expect(
      [city, friendlyCity, enemyCity]
        .map((city) => reduceYield(city.yields(), Unhappiness))
        .every((unhappiness) => unhappiness === 10)
    ).true;

    wonderRegistry.register(new JsBachsCathedral(city, ruleRegistry));

    expect(reduceYield(city.yields(), Unhappiness)).equal(8);
    expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(8);
    expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(10);

    city.capture(enemyCity.player());

    expect(reduceYield(city.yields(), Unhappiness)).equal(8);
    expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(10);
    expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(8);

    ruleRegistry.unregister(unhappiness);
  });

  it('should eradicate unhappiness in the City that contains ShakespearesTheatre until the discovery of Electronics', async (): Promise<void> => {
    const [city, friendlyCity, enemyCity] = await setUpCities(
      ruleRegistry,
      playerWorldRegistry,
      availableBuildItemsRegistry,
      advanceRegistry,
      cityBuildRegistry,
      playerResearchRegistry,
      playerGovernmentRegistry,
      availableGovernmentRegistry
    );

    const unhappiness = new Yield(new Effect(() => new Unhappiness(10)));

    ruleRegistry.register(unhappiness);

    expect(
      [city, friendlyCity, enemyCity]
        .map((city) => reduceYield(city.yields(), Unhappiness))
        .every((unhappiness) => unhappiness === 10)
    ).true;

    wonderRegistry.register(new ShakespearesTheatre(city, ruleRegistry));

    expect(reduceYield(city.yields(), Unhappiness)).equal(0);
    expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(10);
    expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(10);

    playerResearchRegistry
      .getByPlayer(enemyCity.player())
      .addAdvance(Electronics);

    expect(
      [city, friendlyCity, enemyCity]
        .map((city) => reduceYield(city.yields(), Unhappiness))
        .every((unhappiness) => unhappiness === 10)
    ).true;

    ruleRegistry.unregister(unhappiness);
  });

  it('should reduce unhappiness for each instance of MilitaryUnhappiness in each of the `Player`s `City`s when the `Player` controls WomensSuffrage', async (): Promise<void> => {
    const [city, friendlyCity, enemyCity] = await setUpCities(
      ruleRegistry,
      playerWorldRegistry,
      availableBuildItemsRegistry,
      advanceRegistry,
      cityBuildRegistry,
      playerResearchRegistry,
      playerGovernmentRegistry,
      availableGovernmentRegistry
    );

    const militaryUnhappinessRules = [Warrior, Spearman, Chariot, Horseman].map(
      (UnitType: typeof Unit) =>
        new CityYield(
          new Effect(
            (city: City) =>
              new MilitaryUnhappiness(
                1,
                new UnitType(null, city.player(), city.tile(), ruleRegistry)
              ) as YieldValue
          )
        )
    );

    ruleRegistry.register(...militaryUnhappinessRules);

    expect(reduceYield(city.yields(), Unhappiness)).equal(4);
    expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(4);
    expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(4);

    wonderRegistry.register(new WomensSuffrage(city, ruleRegistry));

    expect(reduceYield(city.yields(), Unhappiness)).equal(0);
    expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(0);
    expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(4);

    city.capture(enemyCity.player());

    expect(reduceYield(city.yields(), Unhappiness)).equal(0);
    expect(reduceYield(friendlyCity.yields(), Unhappiness)).equal(4);
    expect(reduceYield(enemyCity.yields(), Unhappiness)).equal(0);

    ruleRegistry.unregister(...militaryUnhappinessRules);
  });
});
