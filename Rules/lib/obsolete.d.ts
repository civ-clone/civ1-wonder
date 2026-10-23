import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Wonder from '@civ-clone/core-wonder/Wonder';
/** Each wonder that goes obsolete, and the advance that makes it so, as `Requirements` declares them. */
export declare const obsoletedBy: [typeof Wonder, typeof Advance][];
/**
 * A wonder is obsolete once *anyone* has discovered its obsoleting advance, not
 * just its owner, as the game's requirements say (civ-clone/web-renderer#37), so
 * a plugin that changes them changes this too. Worked out from research rather
 * than recorded, so there's nothing extra to save.
 *
 * `requirementRegistry` is `defaultGame`'s unless given, which holds these entries once this package is registered
 * there (loading it as a plugin does). Another game's are only read if passed: every rule factory here takes them.
 */
export declare const isObsolete: (
  WonderType: typeof Wonder,
  playerResearchRegistry?: PlayerResearchRegistry,
  requirementRegistry?: RequirementRegistry
) => boolean;
export default isObsolete;
