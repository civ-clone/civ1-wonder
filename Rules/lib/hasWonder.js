"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerHasWonder = exports.cityHasWonder = void 0;
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const cityHasWonder = (WonderType, wonderRegistry = WonderRegistry_1.instance) => new Criterion_1.default((city) => wonderRegistry
    .getByCity(city)
    .some((wonder) => wonder instanceof WonderType));
exports.cityHasWonder = cityHasWonder;
const playerHasWonder = (WonderType, wonderRegistry = WonderRegistry_1.instance) => new Criterion_1.default((item) => wonderRegistry
    .getByPlayer(item.player())
    .some((wonder) => wonder instanceof WonderType));
exports.playerHasWonder = playerHasWonder;
//# sourceMappingURL=hasWonder.js.map