"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onWonderLandMass = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const LandMassRegistry_1 = require("@civ-clone/core-world/LandMassRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const obsolete_1 = require("./obsolete");
/**
 * The city's player owns `WonderType`, and the city is on the same continent as
 * the city that holds it (v474.05 compares the two cities' map group ids).
 */
const onWonderLandMass = (WonderType, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => new Criterion_1.default((city) => !(0, obsolete_1.isObsolete)(WonderType, playerResearchRegistry, requirementRegistry) &&
    wonderRegistry
        .getByPlayer(city.player())
        .some((wonder) => {
        var _a, _b;
        return wonder instanceof WonderType &&
            ((_b = (_a = landMassRegistry
                .getByTile(wonder.city().tile())) === null || _a === void 0 ? void 0 : _a.hasTile(city.tile())) !== null && _b !== void 0 ? _b : false);
    }));
exports.onWonderLandMass = onWonderLandMass;
exports.default = exports.onWonderLandMass;
//# sourceMappingURL=onWonderLandMass.js.map