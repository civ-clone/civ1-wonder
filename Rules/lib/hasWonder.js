"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerHasWonder = exports.playerOwnsWonder = exports.cityHasWonder = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const obsolete_1 = require("./obsolete");
const wonderHistory_1 = require("../../lib/wonderHistory");
// Obsolete wonders still exist, but no longer do anything. Nor does one whose city is destroyed, should it still be in
//  `wonders` (`isStanding`, civ-clone/web-renderer#975).
const cityHasWonder = (WonderType, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => new Criterion_1.default((city) => wonderRegistry
    .getByCity(city)
    .some((wonder) => wonder instanceof WonderType && (0, wonderHistory_1.isStanding)(wonder)) &&
    !(0, obsolete_1.isObsolete)(WonderType, playerResearchRegistry, requirementRegistry));
exports.cityHasWonder = cityHasWonder;
const playerOwnsWonder = (player, WonderType, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => wonderRegistry
    .getByPlayer(player)
    .some((wonder) => wonder instanceof WonderType && (0, wonderHistory_1.isStanding)(wonder)) && !(0, obsolete_1.isObsolete)(WonderType, playerResearchRegistry, requirementRegistry);
exports.playerOwnsWonder = playerOwnsWonder;
const playerHasWonder = (WonderType, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => new Criterion_1.default((item) => (0, exports.playerOwnsWonder)(item.player(), WonderType, wonderRegistry, playerResearchRegistry, requirementRegistry));
exports.playerHasWonder = playerHasWonder;
//# sourceMappingURL=hasWonder.js.map