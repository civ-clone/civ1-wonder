"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const RuleIds_1 = require("../../RuleIds");
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Pacified_1 = require("@civ-clone/library-diplomacy/Rules/Player/Pacified");
const isHuman_1 = require("@civ-clone/civ1-difficulty/isHuman");
const hasWonder_1 = require("../lib/hasWonder");
// Every other leader is pacified towards the owner of the Great Wall, until anyone discovers Gunpowder, or of the
//  United Nations: in a parley they always end by offering it a peace treaty (Rome on 640K a Day, pp. 124, 296-297).
//  `civ1-diplomacy` asks these rules in a parley (its `stance`) and when two computer players meet (its
//  `computerDecision`).
//
// v474.05 (civd), in the human's parley (`AUDIENCE.C`), takes both wonders of the human's:
//
//    if (civ_wonder(civnow, 7) || civ_wonder(civnow, 18)) {
//        y = a = 0;
//
// and, when two computer players meet (`DIPLOMAC.C` `diplomacy_event()`), only the Great Wall, of either of them:
//
//    if (!((alliance_ok(a, b) && !civ_wonder(b, 7) && civ_gov[a] < 4)
//          || (alliance_ok(b, a) && !civ_wonder(a, 7) && civ_gov[b] < 4))) {
//
// So the Great Wall's rule is the same in both, and the United Nations' pacifies a leader only towards a human owner:
//  between two computer players it does nothing. `civ1-enhanced` has it act between computer players too, as this
//  package did (civ-clone/web-renderer#30, #960).
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance, clientRegistry = ClientRegistry_1.instance) => [
    new Pacified_1.default(RuleIds_1.GREAT_WALL_PACIFIED_RULE, new Criterion_1.default((player, other) => player !== other &&
        (0, hasWonder_1.playerOwnsWonder)(other, Wonders_1.GreatWall, wonderRegistry, playerResearchRegistry, requirementRegistry)), new Effect_1.default(() => true)),
    new Pacified_1.default(RuleIds_1.UNITED_NATIONS_PACIFIED_RULE, new Criterion_1.default((player, other) => player !== other &&
        (0, hasWonder_1.playerOwnsWonder)(other, Wonders_1.UnitedNations, wonderRegistry, playerResearchRegistry, requirementRegistry)), 
    // `civnow`: every seat not played by the computer counts as v474.05's one human (`civ1-difficulty`'s `isHuman`).
    new Criterion_1.default((player, other) => (0, isHuman_1.default)(other, clientRegistry)), new Effect_1.default(() => true)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pacified.js.map