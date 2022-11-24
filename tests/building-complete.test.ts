import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import {
  Alphabet,
  BronzeWorking,
  CeremonialBurial,
  Masonry,
  Pottery,
  TheWheel,
} from '@civ-clone/civ1-science/Advances';
import Buildable from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import { Colossus, DarwinsVoyage } from '../Wonders';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { Production, Research } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import build from '../Rules/City/build';
import buildCost from '../Rules/City/build-cost';
import buildingComplete from '../Rules/City/building-complete';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Cost from '@civ-clone/core-science/Rules/Cost';
import Effect from '@civ-clone/core-rule/Effect';

describe('city:building-complete', (): void => {
  it('should clear the building progress when the wonder is completed elsewhere', async (): Promise<void> => {
    const advanceRegistry = new AdvanceRegistry(),
      availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
      cityBuildRegistry = new CityBuildRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      city = await setUpCity(),
      cityBuild1 = new CityBuild(
        city,
        availableCityBuildItemsRegistry,
        ruleRegistry
      ),
      cityBuild2 = new CityBuild(
        city,
        availableCityBuildItemsRegistry,
        ruleRegistry
      ),
      playerResearch = new PlayerResearch(
        city.player(),
        advanceRegistry,
        ruleRegistry
      );

    advanceRegistry.register(BronzeWorking);

    playerResearchRegistry.register(playerResearch);

    playerResearch.addAdvance(BronzeWorking);

    cityBuildRegistry.register(cityBuild1, cityBuild2);
    ruleRegistry.register(
      ...build(playerResearchRegistry, wonderRegistry),
      ...buildCost(),
      ...buildingComplete(
        cityBuildRegistry,
        playerResearchRegistry,
        ruleRegistry,
        wonderRegistry
      )
    );
    availableCityBuildItemsRegistry.register(
      Colossus as unknown as typeof Buildable
    );
    cityBuild1.build(Colossus as unknown as typeof Buildable);
    cityBuild2.build(Colossus as unknown as typeof Buildable);

    expect(cityBuild1.building()!.item()).to.equal(Colossus);
    expect(cityBuild2.building()!.item()).to.equal(Colossus);

    cityBuild1.add(new Production(200));
    cityBuild2.add(new Production(200));

    expect(cityBuild1.progress().value()).to.equal(200);
    expect(cityBuild2.progress().value()).to.equal(200);

    cityBuild1.check();

    expect(cityBuild1.building()).to.equal(null);
    expect(cityBuild2.building()).to.equal(null);
    expect(cityBuild1.progress().value()).to.equal(0);
    expect(cityBuild2.progress().value()).to.equal(200);
  });

  it("should grant two Advances when Darwin's Voyage is built", async (): Promise<void> => {
    const advanceRegistry = new AdvanceRegistry(),
      availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
      cityBuildRegistry = new CityBuildRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      city = await setUpCity(),
      cityBuild = new CityBuild(
        city,
        availableCityBuildItemsRegistry,
        ruleRegistry
      ),
      playerResearch = new PlayerResearch(
        city.player(),
        advanceRegistry,
        ruleRegistry
      );

    advanceRegistry.register(
      Alphabet,
      BronzeWorking,
      CeremonialBurial,
      Masonry,
      Pottery,
      TheWheel
    );

    playerResearchRegistry.register(playerResearch);

    cityBuildRegistry.register(cityBuild);
    ruleRegistry.register(
      ...buildCost(),
      ...buildingComplete(
        cityBuildRegistry,
        playerResearchRegistry,
        ruleRegistry,
        wonderRegistry
      ),
      new Cost(new Effect(() => 20))
    );
    availableCityBuildItemsRegistry.register(
      DarwinsVoyage as unknown as typeof Buildable
    );

    expect(wonderRegistry.entries().length).equal(0);
    expect(playerResearch.researching()).null;
    expect(playerResearch.complete()).length(0);

    cityBuild.build(DarwinsVoyage as unknown as typeof Buildable);
    cityBuild.add(cityBuild.cost());
    cityBuild.check();

    expect(wonderRegistry.entries().length).equal(1);

    playerResearch.research(Alphabet);

    expect(playerResearch.complete()).length(1);
    expect(playerResearch.completed(Alphabet)).true;

    playerResearch.research(BronzeWorking);

    expect(playerResearch.complete()).length(2);
    expect(playerResearch.completed(BronzeWorking)).true;

    playerResearch.research(CeremonialBurial);

    expect(playerResearch.complete()).length(2);
    expect(playerResearch.completed(CeremonialBurial)).false;

    wonderRegistry.unregister(...wonderRegistry.entries());
    playerResearch.add(new Research(19));

    cityBuild.build(DarwinsVoyage as unknown as typeof Buildable);
    cityBuild.add(cityBuild.cost());
    cityBuild.check();

    expect(playerResearch.progress().value()).equal(19);
    expect(playerResearch.complete()).length(3);
    expect(playerResearch.completed(CeremonialBurial)).true;

    playerResearch.research(Masonry);

    expect(playerResearch.progress().value()).equal(19);
    expect(playerResearch.complete()).length(4);
    expect(playerResearch.completed(Masonry)).true;

    playerResearch.research(Pottery);

    expect(playerResearch.progress().value()).equal(19);
    expect(playerResearch.complete()).length(4);
    expect(playerResearch.completed(Pottery)).false;
  });
});
