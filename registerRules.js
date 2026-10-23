"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const build_1 = require("./Rules/City/build");
const Requirements_1 = require("./Requirements");
const build_cost_1 = require("./Rules/City/build-cost");
const build_priority_1 = require("./Rules/City/build-priority");
const building_complete_1 = require("./Rules/City/building-complete");
const cost_1 = require("./Rules/City/cost");
const destroyed_1 = require("./Rules/City/destroyed");
const yield_1 = require("./Rules/City/yield");
const pollution_divisor_1 = require("./Rules/City/pollution-divisor");
const yield_modifier_1 = require("./Rules/City/yield-modifier");
const availability_1 = require("./Rules/Governments/availability");
const anarchy_duration_1 = require("./Rules/Player/anarchy-duration");
const pacified_1 = require("./Rules/Player/pacified");
const research_complete_1 = require("./Rules/Player/research-complete");
const started_1 = require("./Rules/PlayerResearch/started");
const action_1 = require("./Rules/Unit/action");
const wonder_helped_1 = require("./Rules/Unit/wonder-helped");
const yield_2 = require("./Rules/Unit/yield");
const obsolete_1 = require("./Rules/Wonder/obsolete");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => {
    game.rules.register((0, build_1.builtOnceRule)(game.wonders));
    // Which Wonders a city may build, and what they make buildable, from the entries in `Requirements`; then, below,
    //  their obsolescence. Each lands where those rules always were, so nothing else moves in the order rules run
    //  (civ-clone/web-renderer#37).
    game.requirements.add((0, build_1.deriveBuildRules)(game.playerResearch, game.wonders), ...Requirements_1.buildRequirements);
    game.rules.register(...(0, build_1.hooverDamPlantRules)(game.playerResearch, game.wonders, game.landMasses, game.requirements), ...(0, build_priority_1.default)(game.cities, game.cityBuilds, game.playerResearch, game.units, game.requirements), ...(0, build_cost_1.default)(), ...(0, building_complete_1.default)(game.cityBuilds, game.playerResearch, game.rules, game.wonders, game.engine, game.pendingEffects), ...(0, cost_1.default)(game.cityImprovements, game.playerGovernments, game.playerResearch, game.units, game.wonders, game.landMasses, game.requirements), ...(0, destroyed_1.default)(game.wonders), ...(0, pollution_divisor_1.default)(game.wonders, game.playerResearch, game.landMasses, game.requirements), ...(0, yield_1.default)(game.playerResearch, game.wonders, game.requirements), ...(0, yield_modifier_1.default)(game.playerResearch, game.wonders, game.cityImprovements, game.landMasses, game.requirements), ...(0, availability_1.default)(game.playerResearch, game.wonders, game.requirements), ...(0, anarchy_duration_1.default)(game.playerResearch, game.wonders, game.requirements), ...(0, pacified_1.default)(game.playerResearch, game.wonders, game.requirements), ...(0, research_complete_1.greatLibraryRules)(game.playerResearch, game.rules, game.wonders, game.requirements));
    game.requirements.add((0, research_complete_1.deriveObsoleteRules)(game.playerResearch, game.rules, game.wonders), ...Requirements_1.obsoletedBy);
    game.rules.register(...(0, started_1.default)(game.pendingEffects), ...(0, action_1.default)(game.cities, game.cityBuilds, game.rules), ...(0, wonder_helped_1.default)(game.cityBuilds, game.rules), ...(0, yield_2.default)(game.wonders, game.playerResearch, game.requirements), ...(0, obsolete_1.default)(game.engine));
};
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map