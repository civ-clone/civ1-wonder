"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObsolete = exports.obsoletedBy = void 0;
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
/** Each wonder that goes obsolete, and the advance that makes it so. */
exports.obsoletedBy = [
    [Wonders_1.Colossus, Advances_1.Electricity],
    [Wonders_1.CopernicusObservatory, Advances_1.Automobile],
    [Wonders_1.GreatLibrary, Advances_1.University],
    [Wonders_1.GreatWall, Advances_1.Gunpowder],
    [Wonders_1.HangingGardens, Advances_1.Invention],
    [Wonders_1.IsaacNewtonsCollege, Advances_1.NuclearFission],
    [Wonders_1.Lighthouse, Advances_1.Magnetism],
    [Wonders_1.MichelangelosChapel, Advances_1.Communism],
    [Wonders_1.Oracle, Advances_1.Religion],
    [Wonders_1.Pyramids, Advances_1.Communism],
    [Wonders_1.ShakespearesTheatre, Advances_1.Electronics],
];
/**
 * A wonder is obsolete once *anyone* has discovered its obsoleting advance, not
 * just its owner. Worked out from research rather than recorded, so there's
 * nothing extra to save.
 */
const isObsolete = (WonderType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => exports.obsoletedBy.some(([ObsoleteWonder, ObsoletingAdvance]) => ObsoleteWonder === WonderType &&
    playerResearchRegistry.some((playerResearch) => playerResearch.completed(ObsoletingAdvance)));
exports.isObsolete = isObsolete;
exports.default = exports.isObsolete;
//# sourceMappingURL=obsolete.js.map