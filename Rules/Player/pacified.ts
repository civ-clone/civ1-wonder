import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  GREAT_WALL_PACIFIED_RULE,
  UNITED_NATIONS_PACIFIED_RULE,
} from '../../RuleIds';
import { GreatWall, UnitedNations } from '../../Wonders';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Pacified from '@civ-clone/library-diplomacy/Rules/Player/Pacified';
import Player from '@civ-clone/core-player/Player';
import isHuman from '@civ-clone/civ1-difficulty/isHuman';
import { playerOwnsWonder } from '../lib/hasWonder';

// Every other leader is pacified towards the owner of the Great Wall, until anyone discovers Gunpowder, or of the
//  United Nations: in a parley they always end by offering it a peace treaty (Rome on 640K a Day, pp. 124, 296-297).
//  `civ1-diplomacy` asks these rules in a parley (its `stance`) and when two computer players meet (its
//  `computerDecision`).
//
// v474.05 (civd), in the human's parley (`AUDIENCE.C`), takes both wonders of the human's:
//
//    if (civ_wonder(civnow, 7) || civ_wonder(civnow, 18)) {
//        y = a = 0;
//
// and, when two computer players meet (`DIPLOMAC.C` `diplomacy_event()`), only the Great Wall, of either of them:
//
//    if (!((alliance_ok(a, b) && !civ_wonder(b, 7) && civ_gov[a] < 4)
//          || (alliance_ok(b, a) && !civ_wonder(a, 7) && civ_gov[b] < 4))) {
//
// So the Great Wall's rule is the same in both, and the United Nations' pacifies a leader only towards a human owner:
//  between two computer players it does nothing. `civ1-enhanced` has it act between computer players too, as this
//  package did (civ-clone/web-renderer#30, #960).
export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry,
  clientRegistry?: ClientRegistry
) => Pacified[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): Pacified[] => [
  new Pacified(
    GREAT_WALL_PACIFIED_RULE,
    new Criterion(
      (player: Player, other: Player): boolean =>
        player !== other &&
        playerOwnsWonder(
          other,
          GreatWall,
          wonderRegistry,
          playerResearchRegistry,
          requirementRegistry
        )
    ),
    new Effect((): boolean => true)
  ),
  new Pacified(
    UNITED_NATIONS_PACIFIED_RULE,
    new Criterion(
      (player: Player, other: Player): boolean =>
        player !== other &&
        playerOwnsWonder(
          other,
          UnitedNations,
          wonderRegistry,
          playerResearchRegistry,
          requirementRegistry
        )
    ),
    // `civnow`: every seat not played by the computer counts as v474.05's one human (`civ1-difficulty`'s `isHuman`).
    new Criterion((player: Player, other: Player): boolean =>
      isHuman(other, clientRegistry)
    ),
    new Effect((): boolean => true)
  ),
];

export default getRules;
