"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const building_complete_1 = require("./Rules/City/building-complete");
const cost_1 = require("./Rules/City/cost");
const yield_1 = require("./Rules/City/yield");
const yield_modifier_1 = require("./Rules/City/yield-modifier");
const destroyed_1 = require("./Rules/City/destroyed");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const research_complete_1 = require("./Rules/Player/research-complete");
const yield_2 = require("./Rules/Unit/yield");
const yield_3 = require("./Rules/Unit/yield");
RuleRegistry_1.instance.register(...(0, build_1.default)(), ...(0, build_cost_1.default)(), ...(0, building_complete_1.default)(), ...(0, cost_1.default)(), ...(0, yield_1.default)(), ...(0, yield_modifier_1.default)(), ...(0, destroyed_1.default)(), ...(0, research_complete_1.default)(), ...(0, yield_2.default)(), ...(0, yield_3.default)());
//# sourceMappingURL=registerRules.js.map