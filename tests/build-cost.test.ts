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
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { expect } from 'chai';
import getRules from '../Rules/City/build-cost';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('City.build-cost', (): void => {
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
      ] as unknown as typeof Buildable[])
    );

    ruleRegistry.register(...getRules());

    (
      [
        [ApolloProgram, 600],
        [Colossus, 200],
        [CopernicusObservatory, 300],
        [CureForCancer, 600],
        [DarwinsVoyage, 300],
        [GreatLibrary, 300],
        [GreatWall, 300],
        [HangingGardens, 300],
        [HooverDam, 600],
        [IsaacNewtonsCollege, 400],
        [JsBachsCathedral, 400],
        [Lighthouse, 200],
        [MagellansExpedition, 400],
        [ManhattanProject, 600],
        [MichelangelosChapel, 300],
        [Oracle, 300],
        [Pyramids, 300],
        [SetiProgram, 600],
        [ShakespearesTheatre, 400],
        [UnitedNations, 600],
        [WomensSuffrage, 600],
      ] as [typeof Wonder, number][]
    ).forEach(([WonderType, cost]: [typeof Wonder, number]) => {
      cityBuild.build(WonderType as unknown as typeof Buildable);

      expect(cityBuild.cost().value()).equal(cost);
    });
  });
});
