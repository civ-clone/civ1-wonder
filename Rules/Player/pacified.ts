import { GreatWall, UnitedNations } from '../../Wonders';
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
import Pacified from '@civ-clone/library-diplomacy/Rules/Player/Pacified';
import Player from '@civ-clone/core-player/Player';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { playerOwnsWonder } from '../lib/hasWonder';

// Every other leader is pacified towards the owner of the Great Wall, until anyone discovers Gunpowder, or of the
//  United Nations: in a parley they always end by offering it a peace treaty (Rome on 640K a Day, pp. 124, 296-297).
//  In v474.05 neither wonder lets the leader be hostile in the human's parley (`MeetWithKing.cs`), and the Great Wall
//  keeps computer players who meet from going to war with its owner (`Segment_2517.cs` `F0_2517_0737`). Here both act
//  in every negotiation, since computer players meet through the same one (civ-clone/web-renderer#30).
export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => Pacified[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Pacified[] =>
  (
    [
      ['great-wall', GreatWall],
      ['united-nations', UnitedNations],
    ] as [string, typeof Wonder][]
  ).map(
    ([key, WonderType]): Pacified =>
      new Pacified(
        `civ1-wonder:player/pacified/${key}`,
        new Criterion(
          (player: Player, other: Player): boolean =>
            player !== other &&
            playerOwnsWonder(
              other,
              WonderType,
              wonderRegistry,
              playerResearchRegistry
            )
        ),
        new Effect((): boolean => true)
      )
  );

export default getRules;
