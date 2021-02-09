"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const BuildCost_1 = require("@civ-clone/core-city-build/Rules/BuildCost");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = () => [
    ...[
        [Wonders_1.Colossus, 200],
        [Wonders_1.CopernicusObservatory, 300],
        [Wonders_1.GreatLibrary, 300],
        [Wonders_1.GreatWall, 300],
        [Wonders_1.HangingGardens, 300],
        [Wonders_1.Lighthouse, 200],
        [Wonders_1.MagellansExpedition, 400],
        [Wonders_1.Oracle, 300],
        [Wonders_1.Pyramids, 300],
    ].map(([WonderType, cost]) => new BuildCost_1.default(new Criterion_1.default((BuildItem) => BuildItem === WonderType), new Effect_1.default(() => cost))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build-cost.js.map