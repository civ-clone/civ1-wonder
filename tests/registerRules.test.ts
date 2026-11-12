import {
  BronzeWorking,
  Masonry,
  NuclearFission,
  Rocketry,
} from '@civ-clone/civ1-science/Advances';
import { Colossus, ManhattanProject, Pyramids } from '../Wonders';
import { Nuclear, Warrior } from '@civ-clone/civ1-unit/Units';
import Buildable from '@civ-clone/core-city-build/Buildable';
import BuildingCancelled from '@civ-clone/core-city-build/Rules/BulidingCancelled';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import { Production } from '@civ-clone/civ1-city/Yields';
import World from '@civ-clone/core-world/World';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';
import { instance as globalCityImprovements } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { instance as globalWonders } from '@civ-clone/core-wonder/WonderRegistry';
import registerCity from '@civ-clone/civ1-city/registerRules';
import registerCityImprovement from '@civ-clone/civ1-city-improvement/registerRules';
import registerUnit from '@civ-clone/civ1-unit/registerRules';
import registerWonder from '../registerRules';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

// This package's rules as `registerRules` registers them, in a game of their own whose registries are not the global
//  instances, as a host builds one: each rule reads that game's registries (civ-clone/web-renderer#971).

const names = (things: (Buildable | null | undefined)[]): (string | null)[] =>
  things.map((thing) => thing?.name ?? null);

const setUp = async () => {
  const game = new Game(),
    player = new Player(),
    rival = new Player(),
    cancelled: [string, string | null, string | null][] = [];

  // As the plugin loader registers them: by name.
  [registerCity, registerCityImprovement, registerUnit, registerWonder].forEach(
    (register: (game: Game) => void): void => register(game)
  );

  game.rules.register(
    new BuildingCancelled(
      new Effect((cityBuild: CityBuild): void => {
        cancelled.push([
          cityBuild.city().name(),
          cityBuild.cleared()?.reason ?? null,
          cityBuild.cleared()?.item?.name ?? null,
        ]);
      })
    )
  );

  [player, rival].forEach((owner: Player): void => {
    const research = new PlayerResearch(owner, game.advances, game.rules);

    game.players.register(owner);
    game.playerResearch.register(research);
    game.playerGovernments.register(
      new PlayerGovernment(owner, game.availableGovernments, game.rules)
    );
    [BronzeWorking, Masonry, NuclearFission, Rocketry].forEach((Advance) =>
      research.addAdvance(Advance)
    );
  });

  game.availableCityBuildItems.register(
    ...([
      Colossus,
      ManhattanProject,
      Pyramids,
      Nuclear,
      Warrior,
    ] as unknown as (typeof Buildable)[])
  );

  let world: World | undefined;

  const city = async (owner: Player, x: number, y: number): Promise<City> => {
      const city = await setUpCity({
        name: `${x},${y}`,
        ruleRegistry: game.rules,
        player: owner,
        world,
        tile: world?.get(x, y),
        playerWorldRegistry: game.playerWorlds,
        tileImprovementRegistry: game.tileImprovements,
        cityGrowthRegistry: game.cityGrowth,
        workedTileRegistry: game.workedTiles,
      });

      world = city.tile().map() as World;

      return city;
    },
    available = (city: City): (string | null)[] =>
      names(
        game.cityBuilds
          .getByCity(city)
          .available()
          .map((buildItem) => buildItem.item())
      ),
    // A turn's production in `city`, as `civ1-player`'s turn start gives it.
    produce = (city: City, value: number): void => {
      game.rules.process(
        ProcessYield,
        new Production(value),
        city,
        [] as Yield[]
      );
    },
    state = (cityBuild: CityBuild) => ({
      building: cityBuild.building()?.item().name ?? null,
      cleared: cityBuild.cleared() && {
        reason: cityBuild.cleared()!.reason,
        item: cityBuild.cleared()!.item?.name ?? null,
      },
      progress: cityBuild.progress().value(),
      queued: names(cityBuild.queued()),
      queueDropped: names(cityBuild.queueDropped()),
    });

  const home = await city(player, 2, 2),
    away = await city(rival, 0, 0);

  return {
    available,
    away,
    cancelled,
    city,
    game,
    home,
    player,
    produce,
    state,
  };
};

describe('registerRules', (): void => {
  it("should register the guard that drops a Wonder's rebuild", async (): Promise<void> => {
    const { game } = await setUp();

    expect(
      game.rules
        .get(ProcessYield)
        .map((rule) => rule.id())
        .filter((id) => id?.startsWith('civ1-wonder:'))
    ).eql(['civ1-wonder:city/process-yield/drop-built-wonder']);
  });

  it("should refuse a Wonder lost in the game, and offer Nuclear units, from the game's own registries", async (): Promise<void> => {
    const { available, away, game, home } = await setUp(),
      awayBuild = game.cityBuilds.getByCity(away);

    expect(available(home))
      .include('ManhattanProject')
      .and.not.include('Nuclear');

    awayBuild.build(ManhattanProject as unknown as typeof Buildable);
    awayBuild.add(new Production(awayBuild.remaining()));
    awayBuild.check();
    away.destroy();

    // Lost in this game, which no global registry knows of.
    expect(game.cityImprovements.getByType(ManhattanProject, true)).length(1);
    expect(game.wonders.entries()).eql([]);
    expect(globalCityImprovements.getByType(ManhattanProject, true)).eql([]);
    expect(globalWonders.entries()).eql([]);

    expect(available(home))
      .include('Nuclear')
      .and.not.include('ManhattanProject');
  });

  it("should drop a Wonder being built again once lost, from the game's own registries, rather than complete it", async (): Promise<void> => {
    const { away, game, home, produce, state } = await setUp(),
      homeBuild = game.cityBuilds.getByCity(home);

    // As a game saved before #971 could hold it: a city part way through a Wonder that was built, then lost.
    homeBuild.build(ManhattanProject as unknown as typeof Buildable);
    homeBuild.add(new Production(100));
    game.wonders.register(new ManhattanProject(away, game.rules));
    away.destroy();

    produce(home, 600);

    expect(state(homeBuild)).include({ building: null, progress: 700 });
    expect(state(homeBuild).cleared).eql({
      reason: 'unavailable',
      item: 'ManhattanProject',
    });
    expect(game.cityImprovements.getByType(ManhattanProject, true)).length(1);
  });

  describe('a Wonder completed', (): void => {
    // A Wonder is registered among the improvements as it is created, before `CityBuild#check` moves on to the next
    //  queued item and before `building-complete` registers it among the Wonders. With every package loaded, the city
    //  that built it already can't choose it again at that point, before #971 as after: `civ1-city-improvement`'s
    //  `city/build/not-built` refuses an improvement the city has. So neither its queue nor Auto (`civ1-city`'s
    //  `building-complete/auto`, which runs before this package's `building-complete`) can start it again.
    it('should go on to the next thing queued, dropping the same Wonder queued again', async (): Promise<void> => {
      const { cancelled, game, home, produce, state } = await setUp(),
        homeBuild = game.cityBuilds.getByCity(home);

      homeBuild.build(Pyramids as unknown as typeof Buildable);
      homeBuild.enqueue(Pyramids as unknown as typeof Buildable);
      homeBuild.enqueue(Colossus as unknown as typeof Buildable);
      produce(home, 300);

      expect(state(homeBuild)).eql({
        building: 'Colossus',
        cleared: null,
        progress: 0,
        queued: [],
        queueDropped: ['Pyramids'],
      });
      expect(cancelled).eql([]);
      expect(
        game.wonders.entries().map((wonder) => wonder.constructor.name)
      ).eql(['Pyramids']);
    });

    it('should go on to the next thing queued', async (): Promise<void> => {
      const { cancelled, game, home, produce, state } = await setUp(),
        homeBuild = game.cityBuilds.getByCity(home);

      homeBuild.build(Pyramids as unknown as typeof Buildable);
      homeBuild.enqueue(Colossus as unknown as typeof Buildable);
      produce(home, 300);

      expect(state(homeBuild)).eql({
        building: 'Colossus',
        cleared: null,
        progress: 0,
        queued: [],
        queueDropped: [],
      });
      expect(cancelled).eql([]);
    });

    it('should leave a city on Auto with nothing it can choose building nothing, having completed it', async (): Promise<void> => {
      const { cancelled, game, home, produce, state } = await setUp(),
        homeBuild = game.cityBuilds.getByCity(home);

      game.availableCityBuildItems.unregister(
        ...([
          Colossus,
          ManhattanProject,
          Nuclear,
          Warrior,
        ] as unknown as (typeof Buildable)[])
      );
      homeBuild.setAuto(true);
      homeBuild.build(Pyramids as unknown as typeof Buildable);
      produce(home, 300);

      expect(state(homeBuild)).eql({
        building: null,
        cleared: { reason: 'completed', item: 'Pyramids' },
        progress: 0,
        queued: [],
        queueDropped: [],
      });
      expect(cancelled).eql([]);
    });
  });
});
