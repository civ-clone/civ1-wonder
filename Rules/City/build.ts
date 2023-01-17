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
import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { Nuclear } from '@civ-clone/civ1-unit/Units';
import Unit from '@civ-clone/core-unit/Unit';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => Build[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Build[] => [
  new Build(
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
  ).map(
    ([WonderType, RequiredAdvance]): Build =>
      new Build(
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
];

export default getRules;
