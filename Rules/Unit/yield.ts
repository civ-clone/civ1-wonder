import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
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
import Description from '@civ-clone/core-rule/Description';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import { Movement } from '@civ-clone/core-unit/Yields';
import { Naval } from '@civ-clone/civ1-unit/Types';
import Unit from '@civ-clone/core-unit/Unit';
import { isA } from '@civ-clone/core-unit/traits';
import UnitYield from '@civ-clone/core-unit/Rules/Yield';
import Yield from '@civ-clone/core-yield/Yield';
import { playerHasWonder } from '../lib/hasWonder';

/** The moves each Wonder adds to its owner's ships. */
export const lighthouseMoves: number = 1,
  magellansMoves: number = 1;

export const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  requirementRegistry?: RequirementRegistry
) => UnitYield[] = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): UnitYield[] => [
  new UnitYield(
    new Low(),
    new Criterion(
      (unit: Unit, unitYield: Yield): boolean => unitYield instanceof Movement
    ),
    new Criterion((unit: Unit): boolean => isA(unit, Naval)),
    playerHasWonder(
      Lighthouse,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    new Effect((unit: Unit, unitYield: Yield): void =>
      unitYield.add(lighthouseMoves)
    ),
    // What it does, for the Civilopedia (civ-clone/web-renderer#1196).
    new Description({
      type: 'unit_movement',
      subject: Lighthouse,
      unit: Naval,
      value: lighthouseMoves,
      scope: 'player',
    })
  ),
  new UnitYield(
    new Low(),
    new Criterion(
      (unit: Unit, unitYield: Yield): boolean => unitYield instanceof Movement
    ),
    new Criterion((unit: Unit): boolean => isA(unit, Naval)),
    playerHasWonder(
      MagellansExpedition,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    new Effect((unit: Unit, unitYield: Yield): void =>
      unitYield.add(magellansMoves)
    ),
    new Description({
      type: 'unit_movement',
      subject: MagellansExpedition,
      unit: Naval,
      value: magellansMoves,
      scope: 'player',
    })
  ),
];

export default getRules;
