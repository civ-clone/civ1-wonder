import Advance from '@civ-clone/core-science/Advance';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
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
 * a plugin that changes them changes this too: `isObsolete` is base-wonder's,
 * which reads the `world` entries of `obsoletedBy` (`Rules/Player/research-complete`
 * refuses an obsolete entry of any other range).
 *
 * `requirementRegistry` is `defaultGame`'s unless given, which holds these entries once this package is registered
 * there (loading it as a plugin does). Another game's are only read if passed: every rule factory here takes them.
 */
export { isObsolete, default } from '@civ-clone/base-wonder/lib/obsolete';
