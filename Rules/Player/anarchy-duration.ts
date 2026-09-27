import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import AnarchyDuration from '@civ-clone/civ1-government/Rules/AnarchyDuration';
import Effect from '@civ-clone/core-rule/Effect';
import { pyramidsActive } from '../lib/pyramidsActive';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => AnarchyDuration[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): AnarchyDuration[] => [
  // The Pyramids' owner changes government without passing through Anarchy
  // (Rome on 640K a Day, p314-315).
  new AnarchyDuration(
    'civ1-wonder:player/anarchy-duration/pyramids',
    pyramidsActive(playerResearchRegistry, wonderRegistry),
    new Effect((): number => 0)
  ),
];

export default getRules;
