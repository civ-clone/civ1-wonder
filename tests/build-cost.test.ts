import {
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  Lighthouse,
  MagellansExpedition,
  Oracle,
  Pyramids,
} from '../Wonders';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { expect } from 'chai';
import getRules from '../Rules/City/build-cost';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('city:build-cost', (): void => {
  it('should cost expected amount of production to build wonders', async (): Promise<void> => {
    const availableCityBuildItemsRegistry =
        new AvailableCityBuildItemsRegistry(),
      ruleRegistry = new RuleRegistry(),
      city = await setUpCity(),
      cityBuild = new CityBuild(
        city,
        availableCityBuildItemsRegistry,
        ruleRegistry
      );

    availableCityBuildItemsRegistry.register(
      ...([
        Colossus,
        CopernicusObservatory,
        GreatLibrary,
        GreatWall,
        HangingGardens,
        Lighthouse,
        MagellansExpedition,
        Oracle,
        Pyramids,
      ] as unknown as typeof Buildable[])
    );

    ruleRegistry.register(...getRules());

    (
      [
        [Colossus, 200],
        [CopernicusObservatory, 300],
        [GreatLibrary, 300],
        [GreatWall, 300],
        [HangingGardens, 300],
        [Lighthouse, 200],
        [MagellansExpedition, 400],
        [Oracle, 300],
        [Pyramids, 300],
      ] as [typeof Wonder, number][]
    ).forEach(([WonderType, cost]: [typeof Wonder, number]) => {
      cityBuild.build(WonderType as unknown as typeof Buildable);

      expect(cityBuild.cost().value()).equal(cost);
    });
  });
});
