"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const building_complete_1 = require("./Rules/City/building-complete");
const yield_1 = require("./Rules/City/yield");
const research_complete_1 = require("./Rules/Player/research-complete");
const yield_2 = require("./Rules/Unit/yield");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
RuleRegistry_1.instance.register(...build_1.default(), ...build_cost_1.default(), ...building_complete_1.default(), ...yield_1.default(), ...research_complete_1.default(), ...yield_2.default());
//# sourceMappingURL=registerRules.js.map