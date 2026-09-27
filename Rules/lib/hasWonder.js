"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerHasWonder = exports.playerOwnsWonder = exports.cityHasWonder = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const obsolete_1 = require("./obsolete");
// Obsolete wonders still exist, but no longer do anything.
const cityHasWonder = (WonderType, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default((city) => wonderRegistry
    .getByCity(city)
    .some((wonder) => wonder instanceof WonderType) &&
    !(0, obsolete_1.isObsolete)(WonderType, playerResearchRegistry));
exports.cityHasWonder = cityHasWonder;
const playerOwnsWonder = (player, WonderType, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => wonderRegistry
    .getByPlayer(player)
    .some((wonder) => wonder instanceof WonderType) &&
    !(0, obsolete_1.isObsolete)(WonderType, playerResearchRegistry);
exports.playerOwnsWonder = playerOwnsWonder;
const playerHasWonder = (WonderType, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default((item) => (0, exports.playerOwnsWonder)(item.player(), WonderType, wonderRegistry, playerResearchRegistry));
exports.playerHasWonder = playerHasWonder;
//# sourceMappingURL=hasWonder.js.map