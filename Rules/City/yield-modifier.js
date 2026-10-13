"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Wonders_1 = require("../../Wonders");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const LandMassRegistry_1 = require("@civ-clone/core-world/LandMassRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const hasWonder_1 = require("../lib/hasWonder");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const YieldModifier_1 = require("@civ-clone/core-city/Rules/YieldModifier");
const hasCityImprovement_1 = require("../lib/hasCityImprovement");
const onWonderLandMass_1 = require("../lib/onWonderLandMass");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const plants = [
    CityImprovements_1.PowerPlant,
    CityImprovements_1.HydroPlant,
    CityImprovements_1.NuclearPlant,
];
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance) => [
    ...[[Wonders_1.CopernicusObservatory, Yields_1.Research, 1]].map(([WonderType, YieldType, multiplier]) => new YieldModifier_1.default(new Priorities_1.Low(), (0, hasWonder_1.cityHasWonder)(WonderType, wonderRegistry, playerResearchRegistry), new Effect_1.default((city, yields) => new YieldType((0, reduceYields_1.reduceYield)(yields, YieldType) * multiplier, WonderType.name)))),
    ...[[Wonders_1.SetiProgram, Yields_1.Research, 0.5]].map(([WonderType, YieldType, multiplier]) => new YieldModifier_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(WonderType, wonderRegistry, playerResearchRegistry), new Effect_1.default((city, yields) => new YieldType((0, reduceYields_1.reduceYield)(yields, YieldType) * multiplier, WonderType.name)))),
    // Isaac Newton's College raises each Library's and University's +50% to
    // +83%. Bonuses here compound rather than adding to the base, and this
    // package's rules can register before civ1-city-improvement's, so it's a
    // multiplier that gives the same result in any order: 1.5 × 11/9 = 1.83.
    // v474.05 adds base/3 per improvement instead (#390).
    ...[CityImprovements_1.Library, CityImprovements_1.University].map((Improvement) => new YieldModifier_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.IsaacNewtonsCollege, wonderRegistry, playerResearchRegistry), (0, hasCityImprovement_1.hasCityImprovement)(Improvement, cityImprovementRegistry), new Effect_1.default((city, yields) => new Yields_1.Research(Math.floor(((0, reduceYields_1.reduceYield)(yields, Yields_1.Research) * 2) / 9), Wonders_1.IsaacNewtonsCollege.name)))),
    // Hoover Dam acts as a plant in every city on its continent. As in v474.05,
    // it needs a Factory (or Mfg. Plant) and doesn't add to a plant already
    // there.
    new YieldModifier_1.default(new Priorities_1.Low(), (0, onWonderLandMass_1.onWonderLandMass)(Wonders_1.HooverDam, wonderRegistry, playerResearchRegistry, landMassRegistry), new Criterion_1.default((city) => {
        const improvements = cityImprovementRegistry.getByCity(city);
        return (improvements.some((improvement) => improvement instanceof CityImprovements_1.Factory ||
            improvement instanceof CityImprovements_1.ManufacturingPlant) &&
            !improvements.some((improvement) => plants.some((Plant) => improvement instanceof Plant)));
    }), new Effect_1.default((city, yields) => new Yields_1.Production(Math.floor((0, reduceYields_1.reduceYield)(yields, Yields_1.Production) * 0.5), Wonders_1.HooverDam.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map