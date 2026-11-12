"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wonderHistory = exports.wonderStatus = exports.everBuilt = exports.WONDERS_IN_ORIGINAL_ORDER = void 0;
const Wonders_1 = require("../Wonders");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
// Whether a Wonder stands, was lost, or was never built, worked out from the two registries a game already saves, so
//  nothing new is saved (civ-clone/web-renderer#971):
//
// - `wonders` holds each Wonder while it stands (`Rules/City/building-complete` registers it; `Rules/City/destroyed`
//   unregisters it with its city). A captured city's Wonder stays, and its owner is the captor.
// - `cityImprovements` holds every Wonder ever built, as every improvement is registered when it is created
//   (`civ1-city-improvement`'s `Created` rule); one lost with its city stays, flagged `destroyed()`.
//
// v474.05 keeps one entry for each Wonder, `marvel_site` (`GLOBALS.C`: `int marvel_site[22]; /* city holding each
//  wonder (-1 none) */`): the city holding it, -1 for never built, and 0x80 once its city is destroyed (`ECONOMY.C`
//  94-96: `for (j = 1; j <= 21; j++) if (marvel_site[j] == idx) marvel_site[j] = 0x80;`). What reads `!= -1` reads
//  "ever built" (`everBuilt`); what reads the city's owner reads "standing, and whose" (`wonderStatus`), for which a
//  lost Wonder is nobody's (`REPORTS.C` `wonders()`: `strcat(msgtext, " (Destroyed)"); owner = 0;`).
//
// Whether a standing Wonder is of a type is `instanceof`, as the rules reading `wonders` always asked; whether one
//  was ever built also asks `cityImprovements.getByType`, which is by exact constructor: a plugin's subclass of a
//  Wonder, once lost, counts only as itself.
/**
 * This package's Wonders in the original's order, its Wonders of the World report and `marvel_site` indexes 1 to 21:
 *  `achievement_names` (`GAME.H`: `#define achievement_names (improvements + 24)`), from Pyramids (`GAME.C`
 *  `improvements[25]`) to the Cure for Cancer (`improvements[45]`).
 */
exports.WONDERS_IN_ORIGINAL_ORDER = [
    Wonders_1.Pyramids,
    Wonders_1.HangingGardens,
    Wonders_1.Colossus,
    Wonders_1.Lighthouse,
    Wonders_1.GreatLibrary,
    Wonders_1.Oracle,
    Wonders_1.GreatWall,
    Wonders_1.MagellansExpedition,
    Wonders_1.MichelangelosChapel,
    Wonders_1.CopernicusObservatory,
    Wonders_1.ShakespearesTheatre,
    Wonders_1.IsaacNewtonsCollege,
    Wonders_1.JsBachsCathedral,
    Wonders_1.DarwinsVoyage,
    Wonders_1.HooverDam,
    Wonders_1.WomensSuffrage,
    Wonders_1.ManhattanProject,
    Wonders_1.UnitedNations,
    Wonders_1.ApolloProgram,
    Wonders_1.SetiProgram,
    Wonders_1.CureForCancer,
];
const isOfType = (WonderType) => (wonder) => wonder instanceof WonderType;
/**
 * Whether `WonderType` has ever been built, by anyone: standing now, or lost with its city since. v474.05's `!= -1`
 *  readers: a Wonder is offered only while `(marvel_site - 24)[i] == -1` (`ECONOMY.C` 213) and completes only then
 *  (`CITYMGT.C` 673); Nuclear units need `marvel_site[17] != -1` (`ECONOMY.C` 172), spaceship parts
 *  `marvel_site[19] != -1` (`ECONOMY.C` 202). Cheap enough to ask from inside `CityBuild#available()`: an index
 *  lookup, then (only for a Wonder never built) a look through the standing Wonders.
 */
const everBuilt = (WonderType, wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => cityImprovementRegistry.getByType(WonderType, true).length > 0 ||
    wonderRegistry.some(isOfType(WonderType));
exports.everBuilt = everBuilt;
/**
 * Where `WonderType` is and whose, or that it was lost or never built. A standing Wonder wins over a lost one of the
 *  same type: a game from before civ-clone/web-renderer#971 may hold one lost and another built again since.
 */
const wonderStatus = (WonderType, wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    const [standing] = wonderRegistry.filter(isOfType(WonderType));
    if (standing) {
        return {
            type: WonderType,
            state: 'standing',
            wonder: standing,
            city: standing.city(),
            owner: standing.city().player(),
        };
    }
    const lost = cityImprovementRegistry.getByType(WonderType, true).pop();
    if (lost) {
        return {
            type: WonderType,
            state: 'lost',
            wonder: lost,
            city: lost.city(),
            owner: null,
        };
    }
    return {
        type: WonderType,
        state: 'never',
        wonder: null,
        city: null,
        owner: null,
    };
};
exports.wonderStatus = wonderStatus;
/**
 * Every Wonder ever built, standing or lost, as `wonderStatus` gives it, in the original's order
 *  (`WONDERS_IN_ORIGINAL_ORDER`, as its `wonders()` report lists them: `for (i = 1; i <= 21; i++) { if (marvel_site[i]
 *  == -1) continue; ...`). A Wonder another plugin adds comes after this package's, in the order it was first built.
 *  Not for a hot path: it looks through every improvement.
 */
const wonderHistory = (wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    const types = [];
    [...cityImprovementRegistry.entries(), ...wonderRegistry.entries()].forEach((improvement) => {
        if (!(improvement instanceof Wonder_1.default)) {
            return;
        }
        const WonderType = improvement.constructor;
        if (!types.includes(WonderType)) {
            types.push(WonderType);
        }
    });
    const rank = (WonderType) => {
        const index = exports.WONDERS_IN_ORIGINAL_ORDER.indexOf(WonderType);
        return index === -1 ? exports.WONDERS_IN_ORIGINAL_ORDER.length : index;
    };
    return types
        .map((WonderType, index) => ({ WonderType, index }))
        .sort((a, b) => rank(a.WonderType) - rank(b.WonderType) || a.index - b.index)
        .map(({ WonderType }) => (0, exports.wonderStatus)(WonderType, wonderRegistry, cityImprovementRegistry));
};
exports.wonderHistory = wonderHistory;
exports.default = exports.wonderHistory;
//# sourceMappingURL=wonderHistory.js.map