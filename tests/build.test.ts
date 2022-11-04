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
  Navigation,
  NuclearFission,
  Pottery,
  Railroad,
  Religion,
  SpaceFlight,
  TheoryOfGravity,
} from '@civ-clone/civ1-science/Advances';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import build from '../Rules/City/build';
import { expect } from 'chai';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';
import setUpCities from './lib/setUpCities';

describe('City.build', (): void => {
  const ruleRegistry = new RuleRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    wonderRegistry = new WonderRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    availableBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    advanceRegistry = new AdvanceRegistry();

  ruleRegistry.register(...build(playerResearchRegistry, wonderRegistry));

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
      [Colossus, BronzeWorking],
      [CopernicusObservatory, Astronomy],
      [GreatLibrary, Literacy],
      [GreatWall, Masonry],
      [HangingGardens, Pottery],
      [Lighthouse, MapMaking],
      [MagellansExpedition, Navigation],
      [Oracle, CeremonialBurial],
      [Pyramids, Masonry],
      [ApolloProgram, SpaceFlight],
      [CureForCancer, GeneticEngineering],
      [DarwinsVoyage, Railroad],
      [HooverDam, Electronics],
      [IsaacNewtonsCollege, TheoryOfGravity],
      [JsBachsCathedral, Religion],
      [ManhattanProject, NuclearFission],
      [MichelangelosChapel, Religion],
      [SetiProgram, Computers],
      [ShakespearesTheatre, Medicine],
      [UnitedNations, Communism],
      [WomensSuffrage, Industrialization],
    ] as [typeof Wonder, typeof Advance][]
  ).forEach(([WonderType, RequiredAdvance]) =>
    it(`should only be possible to build ${WonderType.name} when you have discovered ${RequiredAdvance.name}`, async (): Promise<void> => {
      const city = await setUpCity({
          ruleRegistry,
        }),
        cityBuild = new CityBuild(
          city,
          availableBuildItemsRegistry,
          ruleRegistry
        ),
        playerResearch = new PlayerResearch(
          city.player(),
          advanceRegistry,
          ruleRegistry
        );

      playerResearchRegistry.register(playerResearch);

      expect(
        cityBuild.available().map((cityBuild) => cityBuild.item())
      ).not.includes(WonderType);

      playerResearch.addAdvance(RequiredAdvance);

      expect(
        cityBuild.available().map((cityBuild) => cityBuild.item())
      ).includes(WonderType);
    })
  );

  it('should only be possible to build a Wonder once', async (): Promise<void> => {
    const [city, friendlyCity, enemyCity] = await setUpCities(
      ruleRegistry,
      playerWorldRegistry,
      availableBuildItemsRegistry,
      advanceRegistry,
      cityBuildRegistry,
      playerResearchRegistry
    );

    expect(city.player()).equal(friendlyCity.player());
    expect(city.player()).not.equal(enemyCity.player());

    playerResearchRegistry.getByPlayer(city.player()).addAdvance(SpaceFlight);
    playerResearchRegistry
      .getByPlayer(enemyCity.player())
      .addAdvance(SpaceFlight);

    expect(
      cityBuildRegistry
        .getByCity(city)
        .available()
        .map((cityBuild) => cityBuild.item())
    ).includes(ApolloProgram);
    expect(
      cityBuildRegistry
        .getByCity(friendlyCity)
        .available()
        .map((cityBuild) => cityBuild.item())
    ).includes(ApolloProgram);
    expect(
      cityBuildRegistry
        .getByCity(enemyCity)
        .available()
        .map((cityBuild) => cityBuild.item())
    ).includes(ApolloProgram);

    wonderRegistry.register(new ApolloProgram(city, ruleRegistry));

    expect(
      cityBuildRegistry
        .getByCity(city)
        .available()
        .map((cityBuild) => cityBuild.item())
    ).not.includes(ApolloProgram);
    expect(
      cityBuildRegistry
        .getByCity(friendlyCity)
        .available()
        .map((cityBuild) => cityBuild.item())
    ).not.includes(ApolloProgram);
    expect(
      cityBuildRegistry
        .getByCity(enemyCity)
        .available()
        .map((cityBuild) => cityBuild.item())
    ).not.includes(ApolloProgram);
  });
});
