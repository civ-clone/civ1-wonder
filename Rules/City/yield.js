"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Wonders_1 = require("../../Wonders");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Yield_1.default(new Priorities_1.High(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Trade), new Criterion_1.default((cityYield, city) => wonderRegistry
        .getByCity(city)
        .some((wonder) => wonder instanceof Wonders_1.Colossus)), 
    // new Criterion((cityYield: Yield, city: City): boolean => ! playerResearchRegistry.getByPlayer('city.player())
    //   .completed(Electricity)
    // ),
    new Effect_1.default((cityYield) => cityYield.add(cityYield.value(), 'colossus'))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Research), new Criterion_1.default((cityYield, city) => wonderRegistry
        .getByCity(city)
        .some((wonder) => wonder instanceof Wonders_1.CopernicusObservatory)), 
    // new Criterion((cityYield: Yield, city: City): boolean => ! playerResearchRegistry.getByPlayer(city.player())
    //   .completed(Automobile)
    // ),
    new Effect_1.default((cityYield) => cityYield.add(cityYield, 'copernicus-observatory'))),
    new Yield_1.default(new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Happiness), new Criterion_1.default((cityYield, city) => wonderRegistry
        .filter((wonder) => wonder instanceof Wonders_1.HangingGardens)
        .some((wonder) => wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Invention)), new Effect_1.default((cityYield) => cityYield.add(1, 'hanging-gardens'))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => wonderRegistry
        .filter((wonder) => wonder instanceof Wonders_1.Oracle)
        .some((wonder) => wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Temple)), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Mysticism)), 
    // new Criterion((cityYield: Yield, city: City): boolean => ! playerResearchRegistry.getByPlayer(city.player())
    //   .completed(Religion)
    // ),
    new Effect_1.default((cityYield) => cityYield.subtract(1, 'oracle'))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => wonderRegistry
        .filter((wonder) => wonder instanceof Wonders_1.Oracle)
        .some((wonder) => wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Temple)), new Criterion_1.default((cityYield, city) => playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Mysticism)), 
    // new Criterion((cityYield, city) => ! playerResearchRegistry.getByPlayer(city.player())
    //   .completed(Religion)
    // ),
    new Effect_1.default((cityYield) => cityYield.subtract(2, 'oracle-mysticism'))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map