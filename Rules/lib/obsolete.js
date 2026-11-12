"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.isObsolete = exports.obsoletedBy = void 0;
const Requirements_1 = require("../../Requirements");
/** Each wonder that goes obsolete, and the advance that makes it so, as `Requirements` declares them. */
exports.obsoletedBy = Requirements_1.obsoletedBy.map((entry) => [
    entry.subject,
    entry.targets[0],
]);
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
var obsolete_1 = require("@civ-clone/base-wonder/lib/obsolete");
Object.defineProperty(exports, "isObsolete", { enumerable: true, get: function () { return obsolete_1.isObsolete; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return obsolete_1.default; } });
//# sourceMappingURL=obsolete.js.map