"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const hasWonder_1 = require("../lib/hasWonder");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const YieldModifier_1 = require("@civ-clone/core-city/Rules/YieldModifier");
const hasDiscovered_1 = require("../lib/hasDiscovered");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    ...[[Wonders_1.CopernicusObservatory, Yields_1.Research, 1, Advances_1.Automobile]].map(([WonderType, YieldType, multiplier, ObsoletingAdvance]) => new YieldModifier_1.default(new Priorities_1.Low(), (0, hasWonder_1.cityHasWonder)(WonderType, wonderRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(ObsoletingAdvance, playerResearchRegistry), new Effect_1.default((city, yields) => new YieldType((0, reduceYields_1.reduceYield)(yields, YieldType) * multiplier, WonderType.name)))),
    ...[[Wonders_1.SetiProgram, Yields_1.Research, 0.5, null]].map(([WonderType, YieldType, multiplier, ObsoletingAdvance]) => new YieldModifier_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(WonderType, wonderRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(ObsoletingAdvance, playerResearchRegistry), new Effect_1.default((city, yields) => new YieldType((0, reduceYields_1.reduceYield)(yields, YieldType) * multiplier, WonderType.name)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map