"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObsolete = exports.obsoletedBy = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const Requirements_1 = require("../../Requirements");
/** Each wonder that goes obsolete, and the advance that makes it so, as `Requirements` declares them. */
exports.obsoletedBy = Requirements_1.obsoletedBy.map((entry) => [
    entry.subject,
    entry.targets[0],
]);
/**
 * A wonder is obsolete once *anyone* has discovered its obsoleting advance, not
 * just its owner, as the game's requirements say (civ-clone/web-renderer#37), so
 * a plugin that changes them changes this too. Worked out from research rather
 * than recorded, so there's nothing extra to save.
 *
 * `requirementRegistry` is `defaultGame`'s unless given, which holds these entries once this package is registered
 * there (loading it as a plugin does). Another game's are only read if passed: every rule factory here takes them.
 */
const isObsolete = (WonderType, playerResearchRegistry = PlayerResearchRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => requirementRegistry
    .for(WonderType, 'obsoletedBy')
    // Only the world's: `Rules/Player/research-complete` refuses an obsolete entry of any other range.
    .filter((entry) => entry.range === 'world')
    .some((entry) => (0, Requirement_1.met)(entry, (target) => playerResearchRegistry.some((playerResearch) => playerResearch.completed(target))));
exports.isObsolete = isObsolete;
exports.default = exports.isObsolete;
//# sourceMappingURL=obsolete.js.map