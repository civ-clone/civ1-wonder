import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  Requirement,
  Target,
  met,
} from '@civ-clone/core-requirement/Requirement';
import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { obsoletedBy as obsoletedByEntries } from '../../Requirements';

/** Each wonder that goes obsolete, and the advance that makes it so, as `Requirements` declares them. */
export const obsoletedBy: [typeof Wonder, typeof Advance][] =
  obsoletedByEntries.map(
    (entry: Requirement): [typeof Wonder, typeof Advance] => [
      entry.subject as typeof Wonder,
      entry.targets[0] as typeof Advance,
    ]
  );

/**
 * A wonder is obsolete once *anyone* has discovered its obsoleting advance, not
 * just its owner, as the game's requirements say (civ-clone/web-renderer#37), so
 * a plugin that changes them changes this too. Worked out from research rather
 * than recorded, so there's nothing extra to save.
 */
export const isObsolete = (
  WonderType: typeof Wonder,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): boolean =>
  requirementRegistry
    .for(WonderType, 'obsoletedBy')
    .some((entry: Requirement): boolean =>
      met(entry, (target: Target): boolean =>
        playerResearchRegistry.some((playerResearch: PlayerResearch): boolean =>
          playerResearch.completed(target as typeof Advance)
        )
      )
    );

export default isObsolete;
