"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const LandMassRegistry_1 = require("@civ-clone/core-world/LandMassRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Wonders_1 = require("../../Wonders");
const PollutionDivisor_1 = require("@civ-clone/civ1-city-improvement/Rules/PollutionDivisor");
const onWonderLandMass_1 = require("../lib/onWonderLandMass");
// Hoover Dam acts as a Hydro Plant in its owner's cities on its continent, so it halves the shields that count towards
//  their pollution too (v474.05 `CityWorker.cs` ~L741-753, civ-clone/web-renderer#32).
const getRules = (wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [
    new PollutionDivisor_1.default('civ1-wonder:city/pollution-divisor/HooverDam', (0, onWonderLandMass_1.onWonderLandMass)(Wonders_1.HooverDam, wonderRegistry, playerResearchRegistry, landMassRegistry, requirementRegistry), new Effect_1.default(() => 2)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pollution-divisor.js.map