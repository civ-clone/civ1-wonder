"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./Rules/City/build");
const building_complete_1 = require("./Rules/City/building-complete");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
RuleRegistry_1.instance.register(...build_1.default(), ...building_complete_1.default());
//# sourceMappingURL=registerRules.js.map