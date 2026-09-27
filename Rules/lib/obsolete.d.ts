import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Wonder from '@civ-clone/core-wonder/Wonder';
/** Each wonder that goes obsolete, and the advance that makes it so. */
export declare const obsoletedBy: [typeof Wonder, typeof Advance][];
/**
 * A wonder is obsolete once *anyone* has discovered its obsoleting advance, not
 * just its owner. Worked out from research rather than recorded, so there's
 * nothing extra to save.
 */
export declare const isObsolete: (
  WonderType: typeof Wonder,
  playerResearchRegistry?: PlayerResearchRegistry
) => boolean;
export default isObsolete;
