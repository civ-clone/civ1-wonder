import {
  ApolloProgram,
  Colossus,
  GreatLibrary,
  ManhattanProject,
  Pyramids,
  UnitedNations,
} from '../Wonders';
import {
  BronzeWorking,
  Communism,
  Masonry,
  NuclearFission,
} from '@civ-clone/civ1-science/Advances';
import {
  Caravan,
  Nuclear,
  Settlers,
  Warrior,
} from '@civ-clone/civ1-unit/Units';
import {
  IWonderStatus,
  WONDERS_IN_ORIGINAL_ORDER,
  everBuilt,
  wonderHistory,
  wonderStatus,
} from '../lib/wonderHistory';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Engine from '@civ-clone/core-engine/Engine';
import { HelpBuildWonder } from '@civ-clone/civ1-unit/Actions';
import LandMassRegistry from '@civ-clone/core-world/LandMassRegistry';
import { PendingEffectRegistry } from '@civ-clone/core-pending-effect';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import { Production } from '@civ-clone/civ1-city/Yields';
import RequirementRegistry from '@civ-clone/core-requirement/RequirementRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import build, { buildRulesFor } from '../Rules/City/build';
import { table } from '@civ-clone/core-requirement/Requirement';
import buildCost from '../Rules/City/build-cost';
import buildingComplete from '../Rules/City/building-complete';
import cityProcessYield from '../Rules/City/process-yield';
import civ1CityProcessYield from '@civ-clone/civ1-city/Rules/City/process-yield';
import { expect } from 'chai';
import improvementCreated from '@civ-clone/civ1-city-improvement/Rules/CityImprovement/created';
import improvementDestroyed from '@civ-clone/civ1-city-improvement/Rules/City/destroyed';
import { playerOwnsWonder } from '../Rules/lib/hasWonder';
import setUpCities from './lib/setUpCities';
import unitAction from '../Rules/Unit/action';
import unitBuildCost from '@civ-clone/civ1-unit/Rules/City/buildCost';
import wonderDestroyed from '../Rules/City/destroyed';
import wonderHelped from '../Rules/Unit/wonder-helped';

// A Wonder lost with its city was built: it isn't built again, and Nuclear units stay buildable once the Manhattan
//  Project has been built (civ-clone/web-renderer#971).

const engine = { emit: (): void => {} } as unknown as Engine;

// What a status says, by ids: a deep comparison of the objects themselves would walk the whole game.
const plain = ({ type, state, wonder, city, owner }: IWonderStatus) => ({
  type: type.name,
  state,
  wonder: wonder?.id() ?? null,
  city: city?.id() ?? null,
  owner: owner?.id() ?? null,
});

/** Whether the guard runs before or after `civ1-city`'s production rule is registered: it must make no difference. */
type GuardOrder = 'guard first' | 'guard last';

const setUp = async (guardOrder: GuardOrder = 'guard first') => {
  const ruleRegistry = new RuleRegistry(),
    advanceRegistry = new AdvanceRegistry(),
    availableBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    cityRegistry = new CityRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    requirementRegistry = new RequirementRegistry(ruleRegistry),
    unitRegistry = new UnitRegistry(),
    wonderRegistry = new WonderRegistry(),
    guard = cityProcessYield(
      cityBuildRegistry,
      wonderRegistry,
      cityImprovementRegistry
    ),
    production = civ1CityProcessYield(
      cityBuildRegistry,
      cityGrowthRegistry,
      unitRegistry,
      ruleRegistry
    );

  ruleRegistry.register(
    ...improvementCreated(cityImprovementRegistry, engine),
    ...improvementDestroyed(cityImprovementRegistry),
    ...wonderDestroyed(wonderRegistry),
    ...build(
      playerResearchRegistry,
      wonderRegistry,
      new LandMassRegistry(),
      requirementRegistry,
      cityImprovementRegistry
    ),
    ...buildCost(),
    ...unitBuildCost(),
    ...buildingComplete(
      cityBuildRegistry,
      playerResearchRegistry,
      ruleRegistry,
      wonderRegistry,
      engine,
      new PendingEffectRegistry()
    ),
    ...unitAction(cityRegistry, cityBuildRegistry, ruleRegistry),
    ...wonderHelped(cityBuildRegistry, ruleRegistry),
    ...(guardOrder === 'guard first'
      ? [...guard, ...production]
      : [...production, ...guard])
  );

  availableBuildItemsRegistry.register(
    ...([
      ApolloProgram,
      Colossus,
      GreatLibrary,
      ManhattanProject,
      Pyramids,
      UnitedNations,
      Nuclear,
      Settlers,
      Warrior,
    ] as unknown as (typeof Buildable)[])
  );
  advanceRegistry.register(BronzeWorking, Communism, Masonry, NuclearFission);

  const [city, friendlyCity, enemyCity] = await setUpCities(
    ruleRegistry,
    playerWorldRegistry,
    availableBuildItemsRegistry,
    advanceRegistry,
    cityBuildRegistry,
    playerResearchRegistry
  );

  cityRegistry.register(city, friendlyCity, enemyCity);

  [city, enemyCity].forEach((city: City): void =>
    [BronzeWorking, Communism, Masonry, NuclearFission].forEach((Advance) =>
      playerResearchRegistry.getByPlayer(city.player()).addAdvance(Advance)
    )
  );

  const available = (city: City): Buildable[] =>
      cityBuildRegistry
        .getByCity(city)
        .available()
        .map((buildItem) => buildItem.item()),
    // As it is built: completed by a city's production, so `Created` registers it among the improvements and
    //  `building-complete` among the Wonders.
    complete = (city: City, WonderType: typeof Wonder): Wonder => {
      const cityBuild = cityBuildRegistry.getByCity(city);

      cityBuild.build(WonderType as unknown as typeof Buildable);
      cityBuild.add(new Production(cityBuild.remaining()));

      return cityBuild.check() as Wonder;
    },
    // A turn's production in `city`, as `civ1-player`'s turn start gives it.
    processProduction = (city: City, value: number = 0): void => {
      ruleRegistry.process(
        ProcessYield,
        new Production(value),
        city,
        [] as Yield[]
      );
    },
    status = (WonderType: typeof Wonder) =>
      wonderStatus(WonderType, wonderRegistry, cityImprovementRegistry);

  return {
    available,
    city,
    cityBuildRegistry,
    cityImprovementRegistry,
    complete,
    enemyCity,
    friendlyCity,
    playerResearchRegistry,
    processProduction,
    requirementRegistry,
    ruleRegistry,
    status,
    unitRegistry,
    wonderRegistry,
  };
};

describe('A Wonder ever built', (): void => {
  it('should not be offered to anyone once built, nor once lost with its city, and Nuclear units should stay buildable', async (): Promise<void> => {
    const {
      available,
      city,
      cityImprovementRegistry,
      complete,
      enemyCity,
      friendlyCity,
      status,
      wonderRegistry,
    } = await setUp();

    expect(available(city)).include(ManhattanProject);
    expect(available(enemyCity)).include(ManhattanProject);
    expect(available(city)).not.include(Nuclear);
    expect(everBuilt(ManhattanProject, wonderRegistry, cityImprovementRegistry))
      .false;

    const manhattanProject = complete(friendlyCity, ManhattanProject);

    expect(manhattanProject).instanceOf(ManhattanProject);
    expect(plain(status(ManhattanProject))).eql(
      plain({
        type: ManhattanProject,
        state: 'standing',
        wonder: manhattanProject,
        city: friendlyCity,
        owner: friendlyCity.player(),
      })
    );
    expect(available(city)).not.include(ManhattanProject);
    expect(available(enemyCity)).not.include(ManhattanProject);
    expect(available(city)).include(Nuclear);
    expect(available(enemyCity)).include(Nuclear);

    friendlyCity.destroy();

    expect(wonderRegistry.entries()).eql([]);
    expect(manhattanProject.destroyed()).true;
    expect(everBuilt(ManhattanProject, wonderRegistry, cityImprovementRegistry))
      .true;
    expect(plain(status(ManhattanProject))).eql(
      plain({
        type: ManhattanProject,
        state: 'lost',
        wonder: manhattanProject,
        city: friendlyCity,
        owner: null,
      })
    );
    expect(available(city)).not.include(ManhattanProject);
    expect(available(enemyCity)).not.include(ManhattanProject);
    expect(available(city)).include(Nuclear);
    expect(available(enemyCity)).include(Nuclear);
  });

  it('should leave Nuclear units unbuildable while the Manhattan Project has never been built', async (): Promise<void> => {
    const { available, city, complete, enemyCity } = await setUp();

    complete(city, Pyramids);

    expect(available(city)).not.include(Nuclear);
    expect(available(enemyCity)).not.include(Nuclear);
  });

  it("should still stand once captured, as the captor's, and its effects follow it; once lost, nobody's, and its effects gone", async (): Promise<void> => {
    const {
      city,
      complete,
      enemyCity,
      friendlyCity,
      playerResearchRegistry,
      requirementRegistry,
      status,
      wonderRegistry,
    } = await setUp();
    const owns = (player: Player): boolean =>
      playerOwnsWonder(
        player,
        Pyramids,
        wonderRegistry,
        playerResearchRegistry,
        requirementRegistry
      );

    const pyramids = complete(friendlyCity, Pyramids);

    expect(owns(city.player())).true;

    friendlyCity.capture(enemyCity.player());

    expect(plain(status(Pyramids))).eql(
      plain({
        type: Pyramids,
        state: 'standing',
        wonder: pyramids,
        city: friendlyCity,
        owner: enemyCity.player(),
      })
    );
    expect(owns(enemyCity.player())).true;
    expect(owns(city.player())).false;
    // What a civilization's score counts (`civ1-score`): its Wonders standing.
    expect(wonderRegistry.getByPlayer(enemyCity.player())).eql([pyramids]);

    friendlyCity.destroy();

    expect(status(Pyramids).owner).null;
    expect(owns(enemyCity.player())).false;
    expect(owns(city.player())).false;
    expect(wonderRegistry.getByPlayer(enemyCity.player())).eql([]);
  });

  it("should count in a `city` or `player` entry only while it stands in that city or the player's", async (): Promise<void> => {
    const {
      available,
      city,
      cityImprovementRegistry,
      complete,
      friendlyCity,
      playerResearchRegistry,
      ruleRegistry,
      wonderRegistry,
    } = await setUp();

    // A plugin's entries: Warrior needs the Pyramids in the player's cities, Settlers in the city's own.
    ruleRegistry.register(
      ...[
        ...table('test:player', 'requires', [[Warrior, Pyramids]], {
          range: 'player',
        }),
        ...table('test:city', 'requires', [[Settlers, Pyramids]], {
          range: 'city',
        }),
      ].flatMap((entry) =>
        buildRulesFor(
          entry,
          playerResearchRegistry,
          wonderRegistry,
          cityImprovementRegistry
        )
      )
    );

    expect(available(city)).not.include.oneOf([Warrior, Settlers]);

    complete(friendlyCity, Pyramids);

    expect(available(city)).include(Warrior).and.not.include(Settlers);
    expect(available(friendlyCity)).include.members([Warrior, Settlers]);

    friendlyCity.destroy();

    expect(available(city)).not.include.oneOf([Warrior, Settlers]);
  });

  it('should be given as standing when one copy was lost and another built again since (a game from before #971)', async (): Promise<void> => {
    const {
      cityImprovementRegistry,
      city,
      enemyCity,
      friendlyCity,
      ruleRegistry,
      status,
      wonderRegistry,
    } = await setUp();
    const lost = new Pyramids(friendlyCity, ruleRegistry);

    wonderRegistry.register(lost);
    friendlyCity.destroy();

    const rebuilt = new Pyramids(enemyCity, ruleRegistry);

    wonderRegistry.register(rebuilt);

    expect(cityImprovementRegistry.getByType(Pyramids, true)).eql([
      lost,
      rebuilt,
    ]);
    expect(plain(status(Pyramids))).eql(
      plain({
        type: Pyramids,
        state: 'standing',
        wonder: rebuilt,
        city: enemyCity,
        owner: enemyCity.player(),
      })
    );
    expect(
      wonderHistory(wonderRegistry, cityImprovementRegistry).map(
        ({ type, state }) => [type, state]
      )
    ).eql([[Pyramids, 'standing']]);
    expect(city.destroyed()).false;
  });

  it('should be given as lost with the city it was last lost with, when lost more than once (a game from before #971)', async (): Promise<void> => {
    const { enemyCity, friendlyCity, ruleRegistry, status, wonderRegistry } =
      await setUp();
    const first = new Pyramids(friendlyCity, ruleRegistry);

    wonderRegistry.register(first);
    friendlyCity.destroy();

    const second = new Pyramids(enemyCity, ruleRegistry);

    wonderRegistry.register(second);
    enemyCity.destroy();

    expect(plain(status(Pyramids))).eql({
      type: 'Pyramids',
      state: 'lost',
      wonder: second.id(),
      city: enemyCity.id(),
      owner: null,
    });
  });

  it('should be counted even when only standing, without having been registered as an improvement', async (): Promise<void> => {
    const { city, cityImprovementRegistry, status } = await setUp();
    const wonderRegistry = new WonderRegistry(),
      pyramids = new Pyramids(city, new RuleRegistry());

    wonderRegistry.register(pyramids);

    expect(cityImprovementRegistry.getByType(Pyramids, true)).eql([]);
    expect(everBuilt(Pyramids, wonderRegistry, cityImprovementRegistry)).true;
    expect(
      wonderStatus(Pyramids, wonderRegistry, cityImprovementRegistry)
    ).include({ state: 'standing' });
    expect(
      wonderStatus(Pyramids, wonderRegistry, cityImprovementRegistry).wonder ===
        pyramids
    ).true;
    expect(plain(status(Colossus))).eql(
      plain({
        type: Colossus,
        state: 'never',
        wonder: null,
        city: null,
        owner: null,
      })
    );
  });

  describe('wonderHistory', (): void => {
    it("should list every Wonder ever built, standing or lost, in the original's order, and another plugin's after", async (): Promise<void> => {
      class PluginWonder extends Wonder {}
      class OtherPluginWonder extends Wonder {}

      const {
        city,
        cityImprovementRegistry,
        complete,
        enemyCity,
        friendlyCity,
        ruleRegistry,
        wonderRegistry,
      } = await setUp();

      expect(wonderHistory(wonderRegistry, cityImprovementRegistry)).eql([]);

      const otherPluginWonder = new OtherPluginWonder(city, ruleRegistry);

      wonderRegistry.register(otherPluginWonder);

      const unitedNations = complete(enemyCity, UnitedNations),
        colossus = complete(friendlyCity, Colossus),
        pluginWonder = new PluginWonder(city, ruleRegistry);

      wonderRegistry.register(pluginWonder);

      const pyramids = complete(city, Pyramids);

      friendlyCity.destroy();

      expect(
        wonderHistory(wonderRegistry, cityImprovementRegistry).map(plain)
      ).eql(
        [
          {
            type: Pyramids,
            state: 'standing',
            wonder: pyramids,
            city,
            owner: city.player(),
          },
          {
            type: Colossus,
            state: 'lost',
            wonder: colossus,
            city: friendlyCity,
            owner: null,
          },
          {
            type: UnitedNations,
            state: 'standing',
            wonder: unitedNations,
            city: enemyCity,
            owner: enemyCity.player(),
          },
          {
            type: OtherPluginWonder,
            state: 'standing',
            wonder: otherPluginWonder,
            city,
            owner: city.player(),
          },
          {
            type: PluginWonder,
            state: 'standing',
            wonder: pluginWonder,
            city,
            owner: city.player(),
          },
        ].map(plain)
      );
    });

    it("should hold the original's 21 Wonders, each once, from the Pyramids to the Cure for Cancer", (): void => {
      expect(WONDERS_IN_ORIGINAL_ORDER).length(21);
      expect(new Set(WONDERS_IN_ORIGINAL_ORDER).size).equal(21);
      expect(WONDERS_IN_ORIGINAL_ORDER.map((Type) => Type.name)).eql([
        'Pyramids',
        'HangingGardens',
        'Colossus',
        'Lighthouse',
        'GreatLibrary',
        'Oracle',
        'GreatWall',
        'MagellansExpedition',
        'MichelangelosChapel',
        'CopernicusObservatory',
        'ShakespearesTheatre',
        'IsaacNewtonsCollege',
        'JsBachsCathedral',
        'DarwinsVoyage',
        'HooverDam',
        'WomensSuffrage',
        'ManhattanProject',
        'UnitedNations',
        'ApolloProgram',
        'SetiProgram',
        'CureForCancer',
      ]);
    });
  });

  describe('being built again, in a game saved before #971', (): void => {
    // A city part way through building the Manhattan Project when the first one is lost: before #971 it could go on.
    const partRebuilt = async (guardOrder: GuardOrder = 'guard first') => {
      const set = await setUp(guardOrder),
        {
          city,
          cityBuildRegistry,
          friendlyCity,
          ruleRegistry,
          wonderRegistry,
        } = set,
        rebuilding = cityBuildRegistry.getByCity(city);

      rebuilding.build(ManhattanProject as unknown as typeof Buildable);
      rebuilding.add(new Production(100));
      // The first, completed elsewhere without dropping this build, as an earlier version allowed; then lost.
      wonderRegistry.register(new ManhattanProject(friendlyCity, ruleRegistry));
      friendlyCity.destroy();

      expect(rebuilding.building()?.item()).equal(ManhattanProject);

      return { ...set, rebuilding };
    };

    const expectDropped = (
      { rebuilding, wonderRegistry, cityImprovementRegistry }: any,
      shields: number
    ): void => {
      expect(rebuilding.building()).null;
      expect(rebuilding.cleared()).eql({
        reason: 'unavailable',
        item: ManhattanProject,
      });
      expect(rebuilding.progress().value()).equal(shields);
      expect(wonderRegistry.entries()).eql([]);
      expect(cityImprovementRegistry.getByType(ManhattanProject, true)).length(
        1
      );
    };

    (['guard first', 'guard last'] as GuardOrder[]).forEach(
      (guardOrder: GuardOrder): void => {
        it(`should drop it, keeping its shields, before a turn's production would complete it (${guardOrder})`, async (): Promise<void> => {
          const set = await partRebuilt(guardOrder);

          // Enough this turn to complete it.
          set.processProduction(set.city, 600);

          expectDropped(set, 700);
        });
      }
    );

    it('should drop it, not complete it, when it has been bought', async (): Promise<void> => {
      const set = await partRebuilt();

      // As `PlayerTreasury#buy` pays for it: the shields still to find, which the next turn's production completes.
      set.rebuilding.add(new Yield(set.rebuilding.remaining()));
      set.processProduction(set.city, 0);

      expectDropped(set, 600);
    });

    it('should drop it, not complete it, when a Caravan has helped build it', async (): Promise<void> => {
      const set = await partRebuilt(),
        caravan = new Caravan(
          null,
          set.city.player(),
          set.city.tile().getNeighbour('w'),
          set.ruleRegistry
        );

      set.rebuilding.add(new Production(450));
      caravan.moves().set(1);
      set.unitRegistry.register(caravan);
      (
        caravan
          .actions(set.city.tile())
          .find(
            (action) => action instanceof HelpBuildWonder
          ) as HelpBuildWonder
      ).perform();

      expect(set.rebuilding.progress().value()).equal(600);

      set.processProduction(set.city, 0);

      expectDropped(set, 600);
    });

    it('should, with only these rules, drop the same Wonder queued after itself as it is completed', async (): Promise<void> => {
      // A Wonder is registered among the improvements as it is created, before `CityBuild#check` moves on to the next
      //  queued item: `once` refuses it from then on. Without `civ1-city-improvement`'s `city/build/not-built` (which
      //  already refused it there before #971), the old `once` only refused it once `building-complete` registered it
      //  among the Wonders, so the city started it again and then had it cleared as unavailable.
      const set = await setUp(),
        cityBuild = set.cityBuildRegistry.getByCity(set.city);

      cityBuild.build(Pyramids as unknown as typeof Buildable);
      cityBuild.enqueue(Pyramids as unknown as typeof Buildable);
      cityBuild.enqueue(Colossus as unknown as typeof Buildable);
      set.processProduction(set.city, 300);

      expect(cityBuild.building()?.item()).equal(Colossus);
      expect(cityBuild.cleared()).null;
      expect(cityBuild.queued()).eql([]);
      expect(cityBuild.queueDropped()).eql([Pyramids]);
    });

    it('should leave a build of another Wonder, and of a Wonder never built, to complete', async (): Promise<void> => {
      const set = await partRebuilt(),
        other = set.cityBuildRegistry.getByCity(set.enemyCity);

      other.build(Pyramids as unknown as typeof Buildable);
      set.processProduction(set.enemyCity, 300);

      expect(other.building()).null;
      expect(other.cleared()).eql({ reason: 'completed', item: Pyramids });
      expect(status(set, Pyramids).state).equal('standing');
    });
  });
});

const status = (
  { wonderRegistry, cityImprovementRegistry }: any,
  WonderType: typeof Wonder
) => wonderStatus(WonderType, wonderRegistry, cityImprovementRegistry);
