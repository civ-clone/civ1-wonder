"use strict";
// The ids of this package's rules that another package is expected to name (civ-clone/web-renderer#954): a set that
//  supersedes one, or a host that switches or describes it. Imported, a rename breaks the other package's build.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNITED_NATIONS_PACIFIED_RULE = exports.GREAT_WALL_PACIFIED_RULE = void 0;
/** Every other leader is pacified towards the Great Wall's owner, until anyone discovers Gunpowder. */
exports.GREAT_WALL_PACIFIED_RULE = 'civ1-wonder:player/pacified/great-wall';
/** A computer player's leader is pacified towards the human, when the human owns the United Nations. */
exports.UNITED_NATIONS_PACIFIED_RULE = 'civ1-wonder:player/pacified/united-nations';
//# sourceMappingURL=RuleIds.js.map