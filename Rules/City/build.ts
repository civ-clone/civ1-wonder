import {
  Astronomy,
  BronzeWorking,
  CeremonialBurial,
  Literacy,
  MapMaking,
  Masonry,
  Navigation,
  Pottery,
} from '@civ-clone/civ1-science/Advances';
import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
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
} from '../../Wonders';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Advance from '@civ-clone/core-science/Advance';

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

  ...([
    [Colossus, BronzeWorking],
    [CopernicusObservatory, Astronomy],
    [GreatLibrary, Literacy],
    [GreatWall, Masonry],
    [HangingGardens, Pottery],
    [Lighthouse, MapMaking],
    [MagellansExpedition, Navigation],
    [Oracle, CeremonialBurial],
    [Pyramids, Masonry],
  ] as [typeof Wonder, typeof Advance][]).map(
    ([UnitType, RequiredAdvance]): Build =>
      new Build(
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean =>
            BuildItem === UnitType
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
];

export default getRules;
