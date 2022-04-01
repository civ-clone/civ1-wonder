"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Types_1 = require("@civ-clone/civ1-unit/Types");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Governments_1 = require("@civ-clone/civ1-government/Governments");
const Wonders_1 = require("../../Wonders");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Cost_1 = require("@civ-clone/core-city/Rules/Cost");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Cost_1.default(new Priorities_1.Low(), new Criterion_1.default((city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.Oracle && wonder.city().player() === city.player())), new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Temple)), new Criterion_1.default((city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Mysticism)), new Criterion_1.default((city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Religion)), new Effect_1.default((city, yields) => new Yields_1.Unhappiness(-Math.min(1, (0, reduceYields_1.reduceYield)(yields, Yields_1.Unhappiness)), Wonders_1.Oracle.name))),
    new Cost_1.default(new Priorities_1.Low(), new Criterion_1.default((city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.Oracle && wonder.city().player() === city.player())), new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Temple)), new Criterion_1.default((city) => playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Mysticism)), new Criterion_1.default((city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Religion)), new Effect_1.default((city, yields) => new Yields_1.Unhappiness(-Math.min(2, (0, reduceYields_1.reduceYield)(yields, Yields_1.Unhappiness)), Wonders_1.Oracle.name))),
    new Cost_1.default(new Priority_1.default(4000), // X Low
    new Criterion_1.default((city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.ShakespearesTheatre &&
        wonder.city().player() === city.player())), new Criterion_1.default((city) => !playerResearchRegistry
        .getByPlayer(city.player())
        .completed(Advances_1.Electronics)), new Effect_1.default((city, yields) => new Yields_1.Unhappiness(-(0, reduceYields_1.reduceYield)(yields, Yields_1.Unhappiness), Wonders_1.ShakespearesTheatre.name))),
    new Cost_1.default(new Priorities_1.Low(), 
    // TODO: path check to city that has it to check it's on the same continent...
    new Criterion_1.default((city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.JsBachsCathedral &&
        wonder.city().player() === city.player())), new Effect_1.default((city, yields) => new Yields_1.Unhappiness(-Math.min(2, (0, reduceYields_1.reduceYield)(yields, Yields_1.Unhappiness)), Wonders_1.JsBachsCathedral.name))),
    new Cost_1.default(new Priorities_1.Low(), new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Cathedral)), new Criterion_1.default((city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.MichelangelosChapel &&
        wonder.city().player() === city.player())), new Criterion_1.default((city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Communism)), new Effect_1.default((city, yields) => new Yields_1.Unhappiness(-Math.min(4, (0, reduceYields_1.reduceYield)(yields, Yields_1.Unhappiness)), Wonders_1.MichelangelosChapel.name))),
    new Cost_1.default(new Priorities_1.Low(), new Criterion_1.default((city) => playerGovernmentRegistry
        .getByPlayer(city.player())
        .is(Governments_1.Republic, Governments_1.Democracy)), new Criterion_1.default((city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.WomensSuffrage &&
        wonder.city().player() === city.player())), new Criterion_1.default((city) => unitRegistry
        .getByCity(city)
        .filter((unit) => [Types_1.Air, Types_1.Fortifiable, Types_1.Naval].some((UnitType) => unit instanceof UnitType) && unit.tile() !== city.tile()).length > 0), new Effect_1.default((city, yields) => new Yields_1.Unhappiness(-Math.min(unitRegistry
        .getByCity(city)
        .filter((unit) => [Types_1.Air, Types_1.Fortifiable, Types_1.Naval].some((UnitType) => unit instanceof UnitType) && unit.tile() !== city.tile()).length, (0, reduceYields_1.reduceYield)(yields, Yields_1.Unhappiness)), Wonders_1.WomensSuffrage.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cost.js.map