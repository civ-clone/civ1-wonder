import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
export declare const cityHasWonder: (
  WonderType: typeof Wonder,
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Criterion<[city: City]>;
export declare const playerOwnsWonder: (
  player: Player,
  WonderType: typeof Wonder,
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => boolean;
export declare const playerHasWonder: (
  WonderType: typeof Wonder,
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Criterion<[item: City | Unit]>;
