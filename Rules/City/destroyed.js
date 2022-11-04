"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Destroyed_1 = require("@civ-clone/core-city/Rules/Destroyed");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (wonderRegistry = WonderRegistry_1.instance) => [
    new Destroyed_1.default(new Criterion_1.default((city) => wonderRegistry.getByCity(city).length > 0), new Effect_1.default((city) => wonderRegistry
        .getByCity(city)
        .forEach((wonder) => wonderRegistry.unregister(wonder)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map