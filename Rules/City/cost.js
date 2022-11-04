"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Wonders_1 = require("../../Wonders");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const hasWonder_1 = require("../lib/hasWonder");
const hasDiscovered_1 = require("../lib/hasDiscovered");
const Cost_1 = require("@civ-clone/core-city/Rules/Cost");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const Yields_1 = require("@civ-clone/civ1-city-happiness/Yields");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Yields_2 = require("@civ-clone/civ1-city/Yields");
const hasCityImprovement_1 = require("../lib/hasCityImprovement");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.Oracle, wonderRegistry), (0, hasCityImprovement_1.hasCityImprovement)(CityImprovements_1.Temple, cityImprovementRegistry), (0, hasDiscovered_1.notDiscoveredByPlayer)(Advances_1.Mysticism, playerResearchRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(Advances_1.Religion, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(1, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.Oracle.name))),
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.Oracle, wonderRegistry), (0, hasCityImprovement_1.hasCityImprovement)(CityImprovements_1.Temple, cityImprovementRegistry), (0, hasDiscovered_1.discoveredByPlayer)(Advances_1.Mysticism, playerResearchRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(Advances_1.Religion, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(2, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.Oracle.name))),
    new Cost_1.default(new Priority_1.default(4000), // X Low
    (0, hasWonder_1.cityHasWonder)(Wonders_1.ShakespearesTheatre, wonderRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(Advances_1.Electronics, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-(0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness), Wonders_1.ShakespearesTheatre.name))),
    new Cost_1.default(new Priorities_1.Low(), 
    // TODO: path check to city that has it to check it's on the same continent...
    (0, hasWonder_1.playerHasWonder)(Wonders_1.JsBachsCathedral, wonderRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(2, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.JsBachsCathedral.name))),
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.MichelangelosChapel, wonderRegistry), (0, hasCityImprovement_1.hasCityImprovement)(CityImprovements_1.Cathedral, cityImprovementRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(Advances_1.Communism, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(4, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.MichelangelosChapel.name))),
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.WomensSuffrage, wonderRegistry), new Criterion_1.default((city, cityYields) => cityYields.some((cityYield) => cityYield instanceof Yields_1.MilitaryUnhappiness)), new Effect_1.default((city, cityYields) => cityYields.flatMap((cityYield) => {
        if (!(cityYield instanceof Yields_1.MilitaryUnhappiness)) {
            return [];
        }
        // TODO: custom `Yield` for this?
        return new Yields_2.Unhappiness(-1, Wonders_1.WomensSuffrage.name);
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cost.js.map