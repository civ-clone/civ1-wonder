import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Complete from '@civ-clone/core-science/Rules/Complete';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { GreatLibrary } from '../../Wonders';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => Complete[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Complete[] => [
  new Complete(
    new Criterion((): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean => wonder instanceof GreatLibrary
      )
    ),
    new Criterion(
      (playerResearch: PlayerResearch, completedResearch: Advance): boolean =>
        playerResearchRegistry.filter(
          (playerResearch: PlayerResearch): boolean =>
            playerResearch.completed(
              completedResearch.constructor as typeof Advance
            )
        ).length >= 3
    ),
    new Criterion(
      (playerResearch: PlayerResearch, completedResearch: Advance): boolean => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder: Wonder): boolean => wonder instanceof GreatLibrary)
            .map((greatLibrary: GreatLibrary): Player => greatLibrary.player()),
          owningPlayerResearch = playerResearchRegistry.getByPlayer(
            owningPlayer
          );
        return !owningPlayerResearch.completed(
          completedResearch.constructor as typeof Advance
        );
      }
    ),
    new Effect(
      (playerResearch: PlayerResearch, completedResearch: Advance): void => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder: Wonder): boolean => wonder instanceof GreatLibrary)
            .map((greatLibrary: GreatLibrary): Player => greatLibrary.player()),
          owningPlayerResearch = playerResearchRegistry.getByPlayer(
            owningPlayer
          );
        return owningPlayerResearch.addAdvance(
          completedResearch.constructor as typeof Advance
        );
      }
    )
  ),
];

export default getRules;
