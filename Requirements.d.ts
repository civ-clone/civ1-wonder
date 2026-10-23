import { Requirement } from '@civ-clone/core-requirement/Requirement';
/** The advance a city's player needs before it can build each Wonder: one rule each. */
export declare const requiresAdvance: Requirement[];
/** Nuclear units need the Manhattan Project, built by anyone in the world (civ-clone/web-renderer#129): one rule. */
export declare const requiresWonder: Requirement[];
/**
 * The advance that makes each Wonder obsolete, once *anyone* has discovered it, not just its owner: one rule each, which
 * announces it the first time. `isObsolete` reads these.
 */
export declare const obsoletedBy: Requirement[];
/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
export declare const buildRequirements: Requirement[];
export default buildRequirements;
