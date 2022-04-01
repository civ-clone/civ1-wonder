import { CopernicusObservatory, SetiProgram } from '../../Wonders';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import { Automobile } from '@civ-clone/civ1-science/Advances';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import { Research } from '@civ-clone/civ1-city/Yields';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => YieldModifier[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
) => [
  ...(
    [
      [CopernicusObservatory, Research, 1, Automobile],
      [SetiProgram, Research, 0.5, null],
    ] as [typeof Wonder, typeof Yield, number, typeof Advance | null][]
  ).map(
    ([WonderType, YieldType, multiplier, ObsoletingAdvance]): YieldModifier =>
      new YieldModifier(
        new Low(),
        new Criterion((city: City): boolean =>
          wonderRegistry
            .getByCity(city)
            .some((wonder: Wonder): boolean => wonder instanceof WonderType)
        ),
        new Criterion(
          (city: City): boolean =>
            ObsoletingAdvance === null ||
            !playerResearchRegistry
              .getByPlayer(city.player())
              .completed(ObsoletingAdvance)
        ),
        new Effect(
          (city: City, yields: Yield[]): Yield =>
            new YieldType(
              reduceYield(yields, YieldType) * multiplier,
              WonderType.name
            )
        )
      )
  ),
];

export default getRules;
