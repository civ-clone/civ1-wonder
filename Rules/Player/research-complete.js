"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const obsolete_1 = require("../lib/obsolete");
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Complete_1 = require("@civ-clone/core-science/Rules/Complete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Obsolete_1 = require("@civ-clone/core-wonder/Rules/Obsolete");
const hasDiscovered_1 = require("../lib/hasDiscovered");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Complete_1.default(new Criterion_1.default(() => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.GreatLibrary) && !(0, obsolete_1.isObsolete)(Wonders_1.GreatLibrary, playerResearchRegistry)), new Criterion_1.default((playerResearch, completedResearch) => {
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
    ...obsolete_1.obsoletedBy.map(([WonderType, ObsoletingAdvance]) => new Complete_1.default(new Criterion_1.default(() => wonderRegistry
        .entries()
        .some((wonder) => wonder instanceof WonderType)), new Criterion_1.default((playerResearch, advance) => advance instanceof ObsoletingAdvance), 
    // Only the first discovery makes a wonder obsolete; later ones would process `Obsolete` again.
    (0, hasDiscovered_1.notDiscoveredByAnyOtherPlayer)(ObsoletingAdvance, playerResearchRegistry), new Effect_1.default(() => {
        const [wonder] = wonderRegistry.filter((wonder) => wonder instanceof WonderType);
        ruleRegistry.process(Obsolete_1.default, wonder, wonder.city());
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=research-complete.js.map