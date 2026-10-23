"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRequirements = exports.enhancedBy = exports.obsoletedBy = exports.requiresWonder = exports.requiresAdvance = void 0;
const Wonders_1 = require("./Wonders");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const Units_1 = require("@civ-clone/civ1-unit/Units");
// What Civilization's Wonders need, what makes them obsolete, and the units they make buildable, as the entries
//  `Rules/City/build` and `Rules/Player/research-complete` make their rules from (civ-clone/web-renderer#37).
//  `registerRules` adds them to the game's `requirements`, where `isObsolete` reads them.
/** The advance a city's player needs before it can build each Wonder: one rule each. */
exports.requiresAdvance = (0, Requirement_1.table)('civ1-wonder:city/build/requires-advance', 'requires', [
    [Wonders_1.Colossus, Advances_1.BronzeWorking],
    [Wonders_1.CopernicusObservatory, Advances_1.Astronomy],
    [Wonders_1.GreatLibrary, Advances_1.Literacy],
    [Wonders_1.GreatWall, Advances_1.Masonry],
    [Wonders_1.HangingGardens, Advances_1.Pottery],
    [Wonders_1.Lighthouse, Advances_1.MapMaking],
    [Wonders_1.MagellansExpedition, Advances_1.Navigation],
    [Wonders_1.Oracle, Advances_1.Mysticism],
    [Wonders_1.Pyramids, Advances_1.Masonry],
    [Wonders_1.ApolloProgram, Advances_1.SpaceFlight],
    [Wonders_1.CureForCancer, Advances_1.GeneticEngineering],
    [Wonders_1.DarwinsVoyage, Advances_1.Railroad],
    [Wonders_1.HooverDam, Advances_1.Electronics],
    [Wonders_1.IsaacNewtonsCollege, Advances_1.TheoryOfGravity],
    [Wonders_1.JsBachsCathedral, Advances_1.Religion],
    [Wonders_1.ManhattanProject, Advances_1.NuclearFission],
    [Wonders_1.MichelangelosChapel, Advances_1.Religion],
    [Wonders_1.SetiProgram, Advances_1.Computers],
    [Wonders_1.ShakespearesTheatre, Advances_1.Medicine],
    [Wonders_1.UnitedNations, Advances_1.Communism],
    [Wonders_1.WomensSuffrage, Advances_1.Industrialization],
]);
/** Nuclear units need the Manhattan Project, built by anyone in the world (civ-clone/web-renderer#129): one rule. */
exports.requiresWonder = (0, Requirement_1.table)('civ1-wonder:city/build/requires-wonder', 'requires', [[Units_1.Nuclear, Wonders_1.ManhattanProject]], { range: 'world' });
/**
 * The advance that makes each Wonder obsolete, once *anyone* has discovered it, not just its owner: one rule each, which
 * announces it the first time. `isObsolete` reads these.
 */
exports.obsoletedBy = (0, Requirement_1.table)('civ1-wonder:wonder/obsolete', 'obsoletedBy', [
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
], { range: 'world' });
/** The Oracle calms twice as many citizens once its owner has Mysticism. Only describes: `Rules/City/cost` plays it. */
exports.enhancedBy = (0, Requirement_1.table)('civ1-wonder:wonder/enhanced-by', 'enhancedBy', [[Wonders_1.Oracle, Advances_1.Mysticism]]);
/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
exports.buildRequirements = [
    ...exports.requiresAdvance,
    ...exports.requiresWonder,
];
exports.default = exports.buildRequirements;
//# sourceMappingURL=Requirements.js.map