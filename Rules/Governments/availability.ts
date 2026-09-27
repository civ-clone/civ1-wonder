import {
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '@civ-clone/civ1-government/Governments';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Availability from '@civ-clone/core-government/Rules/Availability';
import Criterion from '@civ-clone/core-rule/Criterion';
import Government from '@civ-clone/core-government/Government';
import Player from '@civ-clone/core-player/Player';
import { pyramidsActive } from '../lib/pyramidsActive';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => Availability[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Availability[] => {
  const hasPyramids = pyramidsActive(playerResearchRegistry, wonderRegistry);

  return [
    // The Pyramids' owner can choose any of the five governments, whichever
    // advances they have (Rome on 640K a Day, p314-315).
    new Availability(
      'civ1-wonder:governments/availability/pyramids',
      new Criterion((GovernmentType: typeof Government): boolean =>
        [Communism, Democracy, Despotism, Monarchy, Republic].includes(
          GovernmentType
        )
      ),
      new Criterion(
        (GovernmentType: typeof Government, player: Player): boolean =>
          hasPyramids.validate(player)
      )
    ),
  ];
};

export default getRules;
