"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const Yields_1 = require("@civ-clone/core-unit/Yields");
const Types_1 = require("@civ-clone/civ1-unit/Types");
const Yield_1 = require("@civ-clone/core-unit/Rules/Yield");
const getRules = (wonderRegistry = WonderRegistry_1.instance) => [
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((unit, unitYield) => unitYield instanceof Yields_1.Movement), new Criterion_1.default((unit) => unit instanceof Types_1.Naval), new Criterion_1.default((unit) => wonderRegistry
        .filter((wonder) => wonder instanceof Wonders_1.Lighthouse)
        .some((wonder) => wonder.player() === unit.player())), new Effect_1.default((unit, unitYield) => unitYield.add(1))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((unit, unitYield) => unitYield instanceof Yields_1.Movement), new Criterion_1.default((unit) => unit instanceof Types_1.Naval), new Criterion_1.default((unit) => wonderRegistry
        .filter((wonder) => wonder instanceof Wonders_1.MagellansExpedition)
        .some((wonder) => wonder.player() === unit.player())), new Effect_1.default((unit, unitYield) => unitYield.add(1))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map