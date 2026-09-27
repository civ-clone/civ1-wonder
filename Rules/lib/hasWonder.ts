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
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { isObsolete } from './obsolete';

// Obsolete wonders still exist, but no longer do anything.

export const cityHasWonder = (
  WonderType: typeof Wonder,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
) =>
  new Criterion(
    (city: City): boolean =>
      wonderRegistry
        .getByCity(city)
        .some((wonder: Wonder): boolean => wonder instanceof WonderType) &&
      !isObsolete(WonderType, playerResearchRegistry)
  );

export const playerOwnsWonder = (
  player: Player,
  WonderType: typeof Wonder,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): boolean =>
  wonderRegistry
    .getByPlayer(player)
    .some((wonder: Wonder): boolean => wonder instanceof WonderType) &&
  !isObsolete(WonderType, playerResearchRegistry);

export const playerHasWonder = (
  WonderType: typeof Wonder,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
) =>
  new Criterion((item: City | Unit): boolean =>
    playerOwnsWonder(
      item.player(),
      WonderType,
      wonderRegistry,
      playerResearchRegistry
    )
  );
