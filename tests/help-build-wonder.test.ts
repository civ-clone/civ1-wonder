import { Caravan, Warrior } from '@civ-clone/civ1-unit/Units';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import { BronzeWorking } from '@civ-clone/civ1-science/Advances';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import { Colossus } from '../Wonders';
import { HelpBuildWonder } from '@civ-clone/civ1-unit/Actions';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { Production } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import build from '../Rules/City/build';
import buildCost from '../Rules/City/build-cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import unitAction from '../Rules/Unit/action';
import unitBuildCost from '@civ-clone/civ1-unit/Rules/City/buildCost';
import wonderHelped from '../Rules/Unit/wonder-helped';

describe('Caravans helping to build a Wonder', (): void => {
  const setUp = async (
    player?: Player
  ): Promise<{
    caravan: Unit;
    city: City;
    cityBuild: CityBuild;
    cityBuildRegistry: CityBuildRegistry;
  }> => {
    const advanceRegistry = new AdvanceRegistry(),
      availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
      cityBuildRegistry = new CityBuildRegistry(),
      cityRegistry = new CityRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      city = await setUpCity({ ruleRegistry }),
      cityBuild = new CityBuild(
        city,
        availableCityBuildItemsRegistry,
        ruleRegistry
      ),
      playerResearch = new PlayerResearch(
        city.player(),
        advanceRegistry,
        ruleRegistry
      ),
      caravanPlayer = player ?? city.player(),
      caravan = new Caravan(
        null,
        caravanPlayer,
        city.tile().getNeighbour('e'),
        ruleRegistry
      );

    advanceRegistry.register(BronzeWorking);
    playerResearchRegistry.register(playerResearch);
    playerResearch.addAdvance(BronzeWorking);
    cityRegistry.register(city);
    cityBuildRegistry.register(cityBuild);

    ruleRegistry.register(
      ...build(playerResearchRegistry, wonderRegistry),
      ...buildCost(),
      ...unitBuildCost(),
      ...unitAction(cityRegistry, cityBuildRegistry, ruleRegistry),
      ...wonderHelped(cityBuildRegistry, ruleRegistry)
    );
    availableCityBuildItemsRegistry.register(
      Colossus as unknown as typeof Buildable,
      Warrior as unknown as typeof Buildable
    );

    caravan.moves().set(1);

    return { caravan, city, cityBuild, cityBuildRegistry };
  };

  const helpAction = (caravan: Unit, city: City): HelpBuildWonder | null =>
    (caravan
      .actions(city.tile())
      .find(
        (action) => action instanceof HelpBuildWonder
      ) as HelpBuildWonder) ?? null;

  it('should be offered only in your own city while it builds a Wonder', async (): Promise<void> => {
    const { caravan, city, cityBuild } = await setUp();

    expect(helpAction(caravan, city)).to.null;

    cityBuild.build(Warrior as unknown as typeof Buildable);

    expect(helpAction(caravan, city)).to.null;

    cityBuild.build(Colossus as unknown as typeof Buildable);

    expect(helpAction(caravan, city)).to.instanceOf(HelpBuildWonder);

    const foreign = await setUp(new Player());

    foreign.cityBuild.build(Colossus as unknown as typeof Buildable);

    expect(helpAction(foreign.caravan, foreign.city)).to.null;
  });

  it("should add the Caravan's 50 shields, which stay if production changes", async (): Promise<void> => {
    const { caravan, city, cityBuild } = await setUp();

    cityBuild.build(Colossus as unknown as typeof Buildable);
    cityBuild.add(new Production(10));

    helpAction(caravan, city)!.perform();

    expect(cityBuild.progress().value()).to.equal(60);

    cityBuild.build(Warrior as unknown as typeof Buildable);

    expect(cityBuild.progress().value()).to.equal(60);
  });

  it('should lose any shields over the cost when the Wonder completes', async (): Promise<void> => {
    const { caravan, city, cityBuild } = await setUp();

    cityBuild.build(Colossus as unknown as typeof Buildable);
    cityBuild.add(new Production(190));

    helpAction(caravan, city)!.perform();

    expect(cityBuild.progress().value()).to.equal(240);

    cityBuild.check();

    expect(cityBuild.building()).to.null;
    expect(cityBuild.progress().value()).to.equal(0);
  });
});
