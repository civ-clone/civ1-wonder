import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Player from '@civ-clone/core-player/Player';
import { Pyramids } from '../../Wonders';
import { playerOwnsWonder } from './hasWonder';

/**
 * The player owns the Pyramids and they aren't obsolete yet: no player has
 * discovered Communism.
 */
export const pyramidsActive = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Criterion =>
  new Criterion((player: Player): boolean =>
    playerOwnsWonder(player, Pyramids, wonderRegistry, playerResearchRegistry)
  );

export default pyramidsActive;
