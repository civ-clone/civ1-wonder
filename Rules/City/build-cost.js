"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const BuildCost_1 = require("@civ-clone/core-city-build/Rules/BuildCost");
const getRules = () => [
    ...[
        [Wonders_1.ApolloProgram, 600],
        [Wonders_1.Colossus, 200],
        [Wonders_1.CopernicusObservatory, 300],
        [Wonders_1.CureForCancer, 600],
        [Wonders_1.DarwinsVoyage, 0],
        [Wonders_1.GreatLibrary, 300],
        [Wonders_1.GreatWall, 300],
        [Wonders_1.HangingGardens, 300],
        [Wonders_1.HooverDam, 600],
        [Wonders_1.IsaacNewtonsCollege, 400],
        [Wonders_1.JsBachsCathedral, 400],
        [Wonders_1.Lighthouse, 200],
        [Wonders_1.MagellansExpedition, 400],
        [Wonders_1.ManhattanProject, 600],
        [Wonders_1.MichelangelosChapel, 300],
        [Wonders_1.Oracle, 300],
        [Wonders_1.Pyramids, 300],
        [Wonders_1.SetiProgram, 600],
        [Wonders_1.ShakespearesTheatre, 400],
        [Wonders_1.UnitedNations, 600],
        [Wonders_1.WomensSuffrage, 600],
    ].flatMap(([WonderType, cost]) => (0, BuildCost_1.buildCost)(WonderType, cost)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build-cost.js.map