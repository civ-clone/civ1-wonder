"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Wonders_1 = require("../../Wonders");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
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
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map