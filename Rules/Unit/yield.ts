import { Lighthouse, MagellansExpedition } from '../../Wonders';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import { Movement } from '@civ-clone/core-unit/Yields';
import { Naval } from '@civ-clone/civ1-unit/Types';
import Unit from '@civ-clone/core-unit/Unit';
import UnitYield from '@civ-clone/core-unit/Rules/Yield';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import { Magnetism } from '@civ-clone/civ1-science/Advances';

export const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => UnitYield[] = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): UnitYield[] => [
  new UnitYield(
    new Low(),
    new Criterion(
      (unit: Unit, unitYield: Yield): boolean => unitYield instanceof Movement
    ),
    new Criterion((unit: Unit): boolean => unit instanceof Naval),
    new Criterion((unit: Unit): boolean =>
      wonderRegistry
        .filter((wonder: Wonder): boolean => wonder instanceof Lighthouse)
        .some((wonder: Wonder): boolean => wonder.player() === unit.player())
    ),
    new Criterion(
      (unit: Unit): boolean =>
        !playerResearchRegistry.getByPlayer(unit.player()).completed(Magnetism)
    ),
    new Effect((unit: Unit, unitYield: Yield): void => unitYield.add(1))
  ),
  new UnitYield(
    new Low(),
    new Criterion(
      (unit: Unit, unitYield: Yield): boolean => unitYield instanceof Movement
    ),
    new Criterion((unit: Unit): boolean => unit instanceof Naval),
    new Criterion((unit: Unit): boolean =>
      wonderRegistry
        .filter(
          (wonder: Wonder): boolean => wonder instanceof MagellansExpedition
        )
        .some((wonder: Wonder): boolean => wonder.player() === unit.player())
    ),
    new Effect((unit: Unit, unitYield: Yield): void => unitYield.add(1))
  ),
];

export default getRules;
