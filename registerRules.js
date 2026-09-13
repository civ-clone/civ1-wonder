"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const building_complete_1 = require("./Rules/City/building-complete");
const cost_1 = require("./Rules/City/cost");
const destroyed_1 = require("./Rules/City/destroyed");
const yield_1 = require("./Rules/City/yield");
const yield_modifier_1 = require("./Rules/City/yield-modifier");
const research_complete_1 = require("./Rules/Player/research-complete");
const yield_2 = require("./Rules/Unit/yield");
const obsolete_1 = require("./Rules/Wonder/obsolete");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => game.rules.register(...(0, build_1.default)(game.playerResearch, game.wonders), ...(0, build_cost_1.default)(), ...(0, building_complete_1.default)(game.cityBuilds, game.playerResearch, game.rules, game.wonders, game.engine), ...(0, cost_1.default)(game.cityImprovements, game.playerGovernments, game.playerResearch, game.units, game.wonders), ...(0, destroyed_1.default)(game.wonders), ...(0, yield_1.default)(game.playerResearch, game.wonders), ...(0, yield_modifier_1.default)(game.playerResearch, game.wonders), ...(0, research_complete_1.default)(game.playerResearch, game.rules, game.wonders), ...(0, yield_2.default)(game.wonders, game.playerResearch), ...(0, obsolete_1.default)(game.engine));
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map