import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import { Colossus } from '../Wonders';
import { Production } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import build from '../Rules/City/build';
import buildCost from '../Rules/City/build-cost';
import buildingComplete from '../Rules/City/building-complete';
import { expect } from 'chai';
import {
  instance as playerResearchRegistryInstance,
  PlayerResearchRegistry,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import { BronzeWorking } from '@civ-clone/civ1-science/Advances';
import Buildable from '@civ-clone/core-city-build/Buildable';

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
      ...buildingComplete(cityBuildRegistry, wonderRegistry)
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
});
