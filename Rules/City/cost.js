"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.suffrageContent = exports.michelangeloContent = exports.bachContent = exports.oracleMysticismContent = exports.oracleContent = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Wonders_1 = require("../../Wonders");
const LandMassRegistry_1 = require("@civ-clone/core-world/LandMassRegistry");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const hasWonder_1 = require("../lib/hasWonder");
const hasDiscovered_1 = require("../lib/hasDiscovered");
const Cost_1 = require("@civ-clone/core-city/Rules/Cost");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const Yields_1 = require("@civ-clone/civ1-city-happiness/Yields");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Yields_2 = require("@civ-clone/civ1-city/Yields");
const hasCityImprovement_1 = require("../lib/hasCityImprovement");
const onWonderLandMass_1 = require("../lib/onWonderLandMass");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
// The unhappy citizens each Wonder makes content, read by its rule and by what the rule says it does
//  (civ-clone/web-renderer#1196): the Oracle's in a city with a Temple (more once its owner knows Mysticism), J.S.
//  Bach's in every city of its owner on its continent, Michelangelo's in a city with a Cathedral, and Women's
//  Suffrage's for each unit that makes a citizen unhappy.
exports.oracleContent = 1, exports.oracleMysticismContent = 2, exports.bachContent = 2, exports.michelangeloContent = 2, exports.suffrageContent = 1;
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.Oracle, wonderRegistry, playerResearchRegistry, requirementRegistry), (0, hasCityImprovement_1.hasCityImprovement)(CityImprovements_1.Temple, cityImprovementRegistry), (0, hasDiscovered_1.notDiscoveredByPlayer)(Advances_1.Mysticism, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(exports.oracleContent, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.Oracle.name)), new Description_1.default({
        type: 'content',
        subject: Wonders_1.Oracle,
        value: exports.oracleContent,
        step: 'more',
        inCitiesWith: [CityImprovements_1.Temple],
        until: Advances_1.Mysticism,
        scope: 'player',
    })),
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.Oracle, wonderRegistry, playerResearchRegistry, requirementRegistry), (0, hasCityImprovement_1.hasCityImprovement)(CityImprovements_1.Temple, cityImprovementRegistry), (0, hasDiscovered_1.discoveredByPlayer)(Advances_1.Mysticism, playerResearchRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(exports.oracleMysticismContent, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.Oracle.name)), new Description_1.default({
        type: 'content',
        subject: Wonders_1.Oracle,
        value: exports.oracleMysticismContent,
        step: 'more',
        inCitiesWith: [CityImprovements_1.Temple],
        with: [Advances_1.Mysticism],
        scope: 'player',
    })),
    new Cost_1.default(new Priority_1.default(4000), // X Low
    (0, hasWonder_1.cityHasWonder)(Wonders_1.ShakespearesTheatre, wonderRegistry, playerResearchRegistry, requirementRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-(0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness), Wonders_1.ShakespearesTheatre.name)), new Description_1.default({
        type: 'content',
        subject: Wonders_1.ShakespearesTheatre,
        amount: 'all',
    })),
    new Cost_1.default(new Priorities_1.Low(), (0, onWonderLandMass_1.onWonderLandMass)(Wonders_1.JsBachsCathedral, wonderRegistry, playerResearchRegistry, landMassRegistry, requirementRegistry), new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(exports.bachContent, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.JsBachsCathedral.name)), new Description_1.default({
        type: 'content',
        subject: Wonders_1.JsBachsCathedral,
        value: exports.bachContent,
        scope: 'continent',
    })),
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.MichelangelosChapel, wonderRegistry, playerResearchRegistry, requirementRegistry), (0, hasCityImprovement_1.hasCityImprovement)(CityImprovements_1.Cathedral, cityImprovementRegistry), 
    // A Cathedral makes 6 content instead of 4: civ1-city-happiness gives the 4.
    new Effect_1.default((city, yields) => new Yields_2.Unhappiness(-Math.min(exports.michelangeloContent, (0, reduceYields_1.reduceYield)(yields, Yields_2.Unhappiness)), Wonders_1.MichelangelosChapel.name)), new Description_1.default({
        type: 'content',
        subject: Wonders_1.MichelangelosChapel,
        value: exports.michelangeloContent,
        step: 'more',
        inCitiesWith: [CityImprovements_1.Cathedral],
        scope: 'player',
    })),
    new Cost_1.default(new Priorities_1.Low(), (0, hasWonder_1.playerHasWonder)(Wonders_1.WomensSuffrage, wonderRegistry, playerResearchRegistry, requirementRegistry), new Criterion_1.default((city, cityYields) => cityYields.some((cityYield) => cityYield instanceof Yields_1.MilitaryUnhappiness)), new Effect_1.default((city, cityYields) => cityYields.flatMap((cityYield) => {
        if (!(cityYield instanceof Yields_1.MilitaryUnhappiness)) {
            return [];
        }
        // TODO: custom `Yield` for this?
        return new Yields_2.Unhappiness(-exports.suffrageContent, Wonders_1.WomensSuffrage.name);
    })), new Description_1.default({
        type: 'military_unhappiness',
        subject: Wonders_1.WomensSuffrage,
        value: exports.suffrageContent,
        scope: 'player',
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cost.js.map