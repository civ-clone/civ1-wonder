"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pyramidsActive = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Wonders_1 = require("../../Wonders");
const hasWonder_1 = require("./hasWonder");
/**
 * The player owns the Pyramids and they aren't obsolete yet: no player has
 * discovered Communism.
 */
const pyramidsActive = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => new Criterion_1.default((player) => (0, hasWonder_1.playerOwnsWonder)(player, Wonders_1.Pyramids, wonderRegistry, playerResearchRegistry));
exports.pyramidsActive = pyramidsActive;
exports.default = exports.pyramidsActive;
//# sourceMappingURL=pyramidsActive.js.map