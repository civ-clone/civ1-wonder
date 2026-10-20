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
const Priority_1 = require("@civ-clone/core-rule/Priority");
const YieldModifier_1 = require("@civ-clone/core-city/Rules/YieldModifier");
const onWonderLandMass_1 = require("../lib/onWonderLandMass");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const newtonImprovements = [CityImprovements_1.Library, CityImprovements_1.University];
const plants = [
    CityImprovements_1.PowerPlant,
    CityImprovements_1.HydroPlant,
    CityImprovements_1.NuclearPlant,
];
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance) => [
    // As v474.05 (OpenCivOne's decompile, `CityWorker.cs`), Isaac Newton's College adds a third of the city's base
    //  science for each Library and University, alongside their half each.
    new YieldModifier_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.IsaacNewtonsCollege, wonderRegistry, playerResearchRegistry), new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => newtonImprovements.some((Improvement) => improvement instanceof Improvement))), new Effect_1.default((city, yields, base) => {
        const improvements = cityImprovementRegistry.getByCity(city), count = newtonImprovements.filter((Improvement) => improvements.some((improvement) => improvement instanceof Improvement)).length;
        return new Yields_1.Research(Math.floor((0, reduceYields_1.reduceYield)(base, Yields_1.Research) / 3) * count, Wonders_1.IsaacNewtonsCollege.name);
    })),
    // Hoover Dam acts as a plant in every city on its continent. As in v474.05,
    // it needs a Factory (or Mfg. Plant) and doesn't add to a plant already
    // there.
    new YieldModifier_1.default(new Priorities_1.Low(), (0, onWonderLandMass_1.onWonderLandMass)(Wonders_1.HooverDam, wonderRegistry, playerResearchRegistry, landMassRegistry), new Criterion_1.default((city) => {
        const improvements = cityImprovementRegistry.getByCity(city);
        return (improvements.some((improvement) => improvement instanceof CityImprovements_1.Factory ||
            improvement instanceof CityImprovements_1.ManufacturingPlant) &&
            !improvements.some((improvement) => plants.some((Plant) => improvement instanceof Plant)));
    }), new Effect_1.default((city, yields, base) => new Yields_1.Production(Math.floor((0, reduceYields_1.reduceYield)(base, Yields_1.Production) / 2), Wonders_1.HooverDam.name))),
    // These act on the city's science total, so they come after every `Low` modifier whatever order the packages
    //  register in: Copernicus doubles it, and then SETI adds half of that (v474.05 adds SETI's share as the research is
    //  counted).
    new YieldModifier_1.default(new Priority_1.default(4000), // X Low
    (0, hasWonder_1.cityHasWonder)(Wonders_1.CopernicusObservatory, wonderRegistry, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_1.Research((0, reduceYields_1.reduceYield)(yields, Yields_1.Research), Wonders_1.CopernicusObservatory.name))),
    new YieldModifier_1.default(new Priority_1.default(4000), // X Low
    (0, hasWonder_1.playerHasWonder)(Wonders_1.SetiProgram, wonderRegistry, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_1.Research(Math.floor((0, reduceYields_1.reduceYield)(yields, Yields_1.Research) / 2), Wonders_1.SetiProgram.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map