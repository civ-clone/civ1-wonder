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
} from '../../Wonders';
import {
  Astronomy,
  BronzeWorking,
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
import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import {
  HydroPlant,
  NuclearPlant,
  PowerPlant,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  LandMassRegistry,
  instance as landMassRegistryInstance,
} from '@civ-clone/core-world/LandMassRegistry';
import Advance from '@civ-clone/core-science/Advance';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import { onWonderLandMass } from '../lib/onWonderLandMass';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { Nuclear } from '@civ-clone/civ1-unit/Units';
import Unit from '@civ-clone/core-unit/Unit';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  landMassRegistry?: LandMassRegistry
) => Build[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  landMassRegistry: LandMassRegistry = landMassRegistryInstance
): Build[] => [
  new Build(
    Wonder,
    new Criterion((city: City, BuildItem: IConstructor): boolean =>
      Object.isPrototypeOf.call(Wonder, BuildItem)
    ),
    new Effect(
      (city: City, WonderType: IConstructor): IBuildCriterion =>
        new Criterion(
          (): boolean =>
            wonderRegistry.filter(
              (wonder: Wonder): boolean => wonder instanceof WonderType
            ).length === 0
        )
    )
  ),

  ...(
    [
      [Colossus, BronzeWorking],
      [CopernicusObservatory, Astronomy],
      [GreatLibrary, Literacy],
      [GreatWall, Masonry],
      [HangingGardens, Pottery],
      [Lighthouse, MapMaking],
      [MagellansExpedition, Navigation],
      [Oracle, Mysticism],
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
  ).map(
    ([WonderType, RequiredAdvance]): Build =>
      new Build(
        WonderType,
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean =>
            BuildItem === WonderType
        ),
        new Effect(
          (city: City): IBuildCriterion =>
            new Criterion((): boolean =>
              playerResearchRegistry
                .getByPlayer(city.player())
                .completed(RequiredAdvance)
            )
        )
      )
  ),

  ...([[Nuclear, ManhattanProject]] as [typeof Unit, typeof Wonder][]).map(
    ([UnitType, RequiredWonder]) =>
      new Build(
        UnitType,
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean =>
            BuildItem === UnitType
        ),
        new Effect(
          () =>
            new Criterion((): boolean =>
              wonderRegistry.some((wonder) => wonder instanceof RequiredWonder)
            )
        )
      )
  ),

  // As v474.05's production menu, a city that Hoover Dam already acts as a plant for isn't offered one (OpenCivOne's
  //  decompile, `Segment_1ade.cs` `F0_1ade_0421`).
  ...([PowerPlant, HydroPlant, NuclearPlant] as (typeof CityImprovement)[]).map(
    (Plant): Build => {
      const hooverDam = onWonderLandMass(
        HooverDam,
        wonderRegistry,
        playerResearchRegistry,
        landMassRegistry
      );

      return new Build(
        Plant,
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean => BuildItem === Plant
        ),
        new Effect(
          (city: City): IBuildCriterion =>
            new Criterion((): boolean => !hooverDam.validate(city))
        )
      );
    }
  ),
];

export default getRules;
