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
import setUpCity from '@civ-clone/core-city/tests/lib/setUpCity';

describe('city:building-complete', (): void => {
  it('should clear the building progress when the wonder is completed elsewhere', (): void => {
    const availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
      cityBuildRegistry = new CityBuildRegistry(),
      ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      city = setUpCity(),
      cityBuild1 = new CityBuild(
        city,
        availableCityBuildItemsRegistry,
        ruleRegistry
      ),
      cityBuild2 = new CityBuild(
        city,
        availableCityBuildItemsRegistry,
        ruleRegistry
      );

    cityBuildRegistry.register(cityBuild1, cityBuild2);
    ruleRegistry.register(
      ...build(wonderRegistry),
      ...buildCost(),
      ...buildingComplete(cityBuildRegistry, wonderRegistry)
    );
    availableCityBuildItemsRegistry.register(Colossus);
    cityBuild1.build(Colossus);
    cityBuild2.build(Colossus);

    expect(cityBuild1.building()).to.equal(Colossus);
    expect(cityBuild2.building()).to.equal(Colossus);

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
