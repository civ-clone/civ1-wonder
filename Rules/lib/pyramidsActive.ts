import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import { Communism } from '@civ-clone/civ1-science/Advances';
import Criterion from '@civ-clone/core-rule/Criterion';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import { Pyramids } from '../../Wonders';
import Wonder from '@civ-clone/core-wonder/Wonder';

/**
 * The player owns the Pyramids and they aren't obsolete yet. They go obsolete
 * when anyone discovers Communism, the same point `Player/research-complete`
 * processes `Obsolete` for them.
 */
export const pyramidsActive = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Criterion =>
  new Criterion(
    (player: Player): boolean =>
      wonderRegistry
        .getByPlayer(player)
        .some((wonder: Wonder): boolean => wonder instanceof Pyramids) &&
      !playerResearchRegistry
        .entries()
        .some((playerResearch: PlayerResearch): boolean =>
          playerResearch.completed(Communism)
        )
  );

export default pyramidsActive;
