"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.hooverDamPlantRules = exports.deriveBuildRules = exports.buildRulesFor = exports.builtOnceRule = void 0;
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const RuleIds_1 = require("../../RuleIds");
const Wonders_1 = require("../../Wonders");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const LandMassRegistry_1 = require("@civ-clone/core-world/LandMassRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const Requirements_1 = require("../../Requirements");
const wonderHistory_1 = require("../../lib/wonderHistory");
const onWonderLandMass_1 = require("../lib/onWonderLandMass");
/**
 * A Wonder is built once in the world, and never again, even once it is lost with its city: a state of the game, so a
 * rule written by hand. v474.05 offers a Wonder only while it has never been built (`ECONOMY.C` 213:
 * `if (has_tech(civ, improvements[i].prereq) && (marvel_site - 24)[i] == -1)`), and a lost one is `0x80`, not `-1`
 * (`ECONOMY.C` 94-96). Before civ-clone/web-renderer#971 a lost Wonder could be built again.
 */
const builtOnceRule = (wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => new Build_1.Build('civ1-wonder:city/build/once', Wonder_1.default, new Criterion_1.default((city, BuildItem) => Object.isPrototypeOf.call(Wonder_1.default, BuildItem)), new Effect_1.default((city, WonderType) => new Criterion_1.default(() => !(0, wonderHistory_1.everBuilt)(WonderType, wonderRegistry, cityImprovementRegistry))));
exports.builtOnceRule = builtOnceRule;
/**
 * The rule `entry` is played by: a city may build its subject only once each advance and Wonder it `requires` is held,
 * by the city's player or, for a `world` entry, by anyone (the Manhattan Project, for Nuclear units). A Wonder in a
 * `world` entry counts once it has ever been built, even if it has been lost with its city since: v474.05 offers
 * Nuclear units once the Manhattan Project has ever been built (`ECONOMY.C` 172:
 * `if (i == 25 && (marvel_site[17] == -1 || !has_tech(civ, 27))) continue;`), and a lost Wonder is `0x80`, not `-1`
 * (civ-clone/web-renderer#971). In a `city` or `player` entry it counts only while it stands in that city or the
 * player's.
 */
const buildRulesFor = (entry, playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    if (entry.relation !== 'requires') {
        return [];
    }
    // Whose Wonder or advance counts is the entry's `range`: Civ1's Manhattan Project is anyone's (`world`), an
    //  advance the city's player's (`player`).
    const has = (city, target) => {
        if (Object.prototype.isPrototypeOf.call(Wonder_1.default, target)) {
            const isTarget = (wonder) => wonder instanceof target;
            return entry.range === 'world'
                ? (0, wonderHistory_1.everBuilt)(target, wonderRegistry, cityImprovementRegistry)
                : entry.range === 'city'
                    ? wonderRegistry.getByCity(city).some(isTarget)
                    : wonderRegistry.getByPlayer(city.player()).some(isTarget);
        }
        return entry.range === 'world'
            ? playerResearchRegistry.some((playerResearch) => playerResearch.completed(target))
            : playerResearchRegistry
                .getByPlayer(city.player())
                .completed(target);
    };
    return [
        new Build_1.Build(entry.id, entry.subject, new Criterion_1.default((city, BuildItem) => BuildItem === entry.subject), new Effect_1.default((city) => new Criterion_1.default(() => (0, Requirement_1.met)(entry, (target) => has(city, target))))),
    ];
};
exports.buildRulesFor = buildRulesFor;
/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
const deriveBuildRules = (playerResearchRegistry, wonderRegistry, cityImprovementRegistry = CityImprovementRegistry_1.instance) => (entry) => (0, exports.buildRulesFor)(entry, playerResearchRegistry, wonderRegistry, cityImprovementRegistry);
exports.deriveBuildRules = deriveBuildRules;
/**
 * As v474.05's production menu, a city that Hoover Dam already acts as a plant for isn't offered one (OpenCivOne's
 * decompile, `Segment_1ade.cs` `F0_1ade_0421`).
 */
const hooverDamPlantRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant].map((Plant) => {
    const hooverDam = (0, onWonderLandMass_1.onWonderLandMass)(Wonders_1.HooverDam, wonderRegistry, playerResearchRegistry, landMassRegistry, requirementRegistry);
    return new Build_1.Build(`${RuleIds_1.HOOVER_DAM_PLANT_RULE_PREFIX}/${Plant.name}`, Plant, new Criterion_1.default((city, BuildItem) => BuildItem === Plant), new Effect_1.default((city) => new Criterion_1.default(() => !hooverDam.validate(city))));
});
exports.hooverDamPlantRules = hooverDamPlantRules;
/**
 * Every rule about building Wonders, and what they make buildable or not, as `registerRules` registers them: built
 * once, one for each of `Requirements`' build entries, then Hoover Dam's plants. For a rule registry without a game's
 * `requirements` (tests): a game's are registered through `game.requirements`, so a plugin can change an entry and its
 * rule together.
 */
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    (0, exports.builtOnceRule)(wonderRegistry, cityImprovementRegistry),
    ...Requirements_1.default.flatMap((entry) => (0, exports.buildRulesFor)(entry, playerResearchRegistry, wonderRegistry, cityImprovementRegistry)),
    ...(0, exports.hooverDamPlantRules)(playerResearchRegistry, wonderRegistry, landMassRegistry, requirementRegistry),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map