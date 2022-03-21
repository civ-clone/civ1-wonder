"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Wonders_1 = require("../../Wonders");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    new Yield_1.default(new Priorities_1.High(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Trade), new Criterion_1.default((cityYield, city) => wonderRegistry
        .getByCity(city)
        .some((wonder) => wonder instanceof Wonders_1.Colossus)), new Criterion_1.default((cityYield, city) => !playerResearchRegistry
        .getByPlayer(city.player())
        .completed(Advances_1.Electricity)), new Effect_1.default((cityYield) => cityYield.add(cityYield.value(), Wonders_1.Colossus.name))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Research), new Criterion_1.default((cityYield, city) => wonderRegistry
        .getByCity(city)
        .some((wonder) => wonder instanceof Wonders_1.CopernicusObservatory)), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Automobile)), new Effect_1.default((cityYield) => cityYield.add(cityYield, Wonders_1.CopernicusObservatory.name))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Research), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.SetiProgram &&
        wonder.city().player() === city.player())), new Effect_1.default((cityYield) => cityYield.add(cityYield.value() * 0.5, Wonders_1.SetiProgram.name))),
    new Yield_1.default(new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Happiness), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.HangingGardens &&
        wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Invention)), new Effect_1.default((cityYield) => cityYield.add(1, Wonders_1.HangingGardens.name))),
    new Yield_1.default(new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Happiness), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.CureForCancer &&
        wonder.city().player() === city.player())), new Effect_1.default((cityYield) => cityYield.add(1, Wonders_1.CureForCancer.name))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.Oracle && wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Temple)), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Mysticism)), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Religion)), new Effect_1.default((cityYield) => cityYield.subtract(1, Wonders_1.Oracle.name))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.Oracle && wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Temple)), new Criterion_1.default((cityYield, city) => playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Mysticism)), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Religion)), new Effect_1.default((cityYield) => cityYield.subtract(2, Wonders_1.Oracle.name))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.ShakespearesTheatre &&
        wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => !playerResearchRegistry
        .getByPlayer(city.player())
        .completed(Advances_1.Electronics)), new Effect_1.default((cityYield) => cityYield.subtract(cityYield.value(), Wonders_1.ShakespearesTheatre.name))),
    new Yield_1.default(new Priorities_1.Low(), 
    // TODO: path check to city that has it to check it's on the same continent...
    new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.JsBachsCathedral &&
        wonder.city().player() === city.player())), new Effect_1.default((cityYield) => cityYield.subtract(Math.min(cityYield.value(), 2), Wonders_1.JsBachsCathedral.name))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Cathedral)), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.MichelangelosChapel &&
        wonder.city().player() === city.player())), new Criterion_1.default((cityYield, city) => !playerResearchRegistry.getByPlayer(city.player()).completed(Advances_1.Communism)), new Effect_1.default((cityYield) => cityYield.subtract(Math.min(cityYield.value(), 2), Wonders_1.MichelangelosChapel.name))),
    new Yield_1.default(new Priorities_1.Low(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Unhappiness), new Criterion_1.default((cityYield, city) => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.WomensSuffrage &&
        wonder.city().player() === city.player())), new Effect_1.default((cityYield, city) => cityYield.subtract(Math.min(cityYield.value(), unitRegistry
        .getByCity(city)
        .filter((unit) => unit.tile() !== city.tile()).length), Wonders_1.WomensSuffrage.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map