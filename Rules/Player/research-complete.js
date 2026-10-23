"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.greatLibraryRules = exports.deriveObsoleteRules = exports.obsoleteRulesFor = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const obsolete_1 = require("../lib/obsolete");
const Requirements_1 = require("../../Requirements");
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Complete_1 = require("@civ-clone/core-science/Rules/Complete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Obsolete_1 = require("@civ-clone/core-wonder/Rules/Obsolete");
const hasDiscovered_1 = require("../lib/hasDiscovered");
/**
 * The rule `entry` is played by: the first time anyone discovers the advance that makes its Wonder obsolete, the Wonder
 * is announced `Obsolete`. A Wonder is obsoleted by one advance, so an entry naming more is refused.
 */
const obsoleteRulesFor = (entry, playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => {
    if (entry.relation !== 'obsoletedBy') {
        return [];
    }
    if (entry.targets.length !== 1) {
        throw new TypeError(`'${entry.id}': a Wonder is made obsolete by one advance, not ${entry.targets.length}.`);
    }
    const WonderType = entry.subject, [ObsoletingAdvance] = entry.targets;
    return [
        new Complete_1.default(entry.id, new Criterion_1.default(() => wonderRegistry
            .entries()
            .some((wonder) => wonder instanceof WonderType)), new Criterion_1.default((playerResearch, advance) => advance instanceof ObsoletingAdvance), 
        // Only the first discovery makes a wonder obsolete; later ones would process `Obsolete` again.
        (0, hasDiscovered_1.notDiscoveredByAnyOtherPlayer)(ObsoletingAdvance, playerResearchRegistry), new Effect_1.default(() => {
            const [wonder] = wonderRegistry.filter((wonder) => wonder instanceof WonderType);
            ruleRegistry.process(Obsolete_1.default, wonder, wonder.city());
        })),
    ];
};
exports.obsoleteRulesFor = obsoleteRulesFor;
/** What `registerRules` gives the game's `requirements` to make each obsolete entry's rule with. */
const deriveObsoleteRules = (playerResearchRegistry, ruleRegistry, wonderRegistry) => (entry) => (0, exports.obsoleteRulesFor)(entry, playerResearchRegistry, ruleRegistry, wonderRegistry);
exports.deriveObsoleteRules = deriveObsoleteRules;
/** The Great Library's rule: the hand-written part of what happens when research completes. */
const greatLibraryRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [
    new Complete_1.default(new Criterion_1.default(() => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.GreatLibrary) &&
        !(0, obsolete_1.isObsolete)(Wonders_1.GreatLibrary, playerResearchRegistry, requirementRegistry)), new Criterion_1.default((playerResearch, completedResearch) => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder) => wonder instanceof Wonders_1.GreatLibrary)
            .map((greatLibrary) => greatLibrary.city().player()), owningPlayerResearch = playerResearchRegistry.getByPlayer(owningPlayer);
        return !owningPlayerResearch.completed(completedResearch.sourceClass());
    }), new Criterion_1.default((playerResearch, completedResearch) => playerResearchRegistry.filter((playerResearch) => playerResearch.completed(completedResearch.sourceClass())).length >= 3), new Effect_1.default((playerResearch, completedResearch) => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder) => wonder instanceof Wonders_1.GreatLibrary)
            .map((greatLibrary) => greatLibrary.city().player()), owningPlayerResearch = playerResearchRegistry.getByPlayer(owningPlayer);
        return owningPlayerResearch.addAdvance(completedResearch.sourceClass());
    })),
];
exports.greatLibraryRules = greatLibraryRules;
/**
 * Every rule about what happens when research completes, as `registerRules` registers them: the Great Library's, then
 * one for each of `Requirements`' obsolete entries. For a rule registry without a game's `requirements` (tests).
 */
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [
    ...(0, exports.greatLibraryRules)(playerResearchRegistry, ruleRegistry, wonderRegistry, requirementRegistry),
    ...Requirements_1.obsoletedBy.flatMap((entry) => (0, exports.obsoleteRulesFor)(entry, playerResearchRegistry, ruleRegistry, wonderRegistry)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=research-complete.js.map