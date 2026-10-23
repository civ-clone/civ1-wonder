"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.wonderShields = exports.wonderPriority = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const BuildPriority_1 = require("@civ-clone/core-city-build/Rules/BuildPriority");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Types_1 = require("@civ-clone/civ1-unit/Types");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const obsolete_1 = require("../lib/obsolete");
// How much a city on Auto, or a computer player, wants a Wonder (civ-clone/web-renderer#194): a little, next to what the
//  city lacks, and only where it makes `wonderShields` or more, the Wonder would do something for its player, and none
//  of the player's other cities is building it already.
exports.wonderPriority = 1.5;
exports.wonderShields = 5;
// Wonders that only help ships, so do nothing for a player with none.
const forShips = [Wonders_1.Lighthouse, Wonders_1.MagellansExpedition];
// Wonders that do a player more harm than good: the Manhattan Project lets every player build nuclear weapons.
const neverWanted = [Wonders_1.ManhattanProject];
const isWonder = (BuildItem) => Object.prototype.isPrototypeOf.call(Wonder_1.default, BuildItem);
const getRules = (cityRegistry = CityRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [
    new BuildPriority_1.default('civ1-wonder:city/build-priority/wonder', new Criterion_1.default((cityBuild, BuildItem) => isWonder(BuildItem)), new Criterion_1.default((cityBuild, BuildItem) => !neverWanted.includes(BuildItem) &&
        !(0, obsolete_1.isObsolete)(BuildItem, playerResearchRegistry, requirementRegistry)), new Criterion_1.default((cityBuild, BuildItem) => !forShips.includes(BuildItem) ||
        unitRegistry
            .getByPlayer(cityBuild.city().player())
            .some((unit) => unit instanceof Types_1.Naval)), new Criterion_1.default((cityBuild, BuildItem) => !cityRegistry
        .getByPlayer(cityBuild.city().player())
        .some((city) => {
        var _a;
        return city !== cityBuild.city() &&
            ((_a = cityBuildRegistry.getByCity(city).building()) === null || _a === void 0 ? void 0 : _a.item()) === BuildItem;
    })), new Criterion_1.default((cityBuild, BuildItem, yields) => yields
        .filter((cityYield) => cityYield instanceof Yields_1.Production)
        .reduce((total, cityYield) => total + cityYield.value(), 0) >= exports.wonderShields), new Effect_1.default(() => exports.wonderPriority)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build-priority.js.map