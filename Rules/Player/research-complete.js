"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Complete_1 = require("@civ-clone/core-science/Rules/Complete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Obsolete_1 = require("@civ-clone/core-wonder/Rules/Obsolete");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Complete_1.default(new Criterion_1.default(() => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.GreatLibrary)), new Criterion_1.default((playerResearch, completedResearch) => {
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
    ...[
        [Wonders_1.Colossus, Advances_1.Electricity],
        [Wonders_1.CopernicusObservatory, Advances_1.Automobile],
        [Wonders_1.GreatLibrary, Advances_1.University],
        [Wonders_1.GreatWall, Advances_1.Gunpowder],
        [Wonders_1.HangingGardens, Advances_1.Invention],
        [Wonders_1.IsaacNewtonsCollege, Advances_1.NuclearFission],
        [Wonders_1.Lighthouse, Advances_1.Magnetism],
        [Wonders_1.MichelangelosChapel, Advances_1.Communism],
        [Wonders_1.Oracle, Advances_1.Religion],
        [Wonders_1.Pyramids, Advances_1.Communism],
        [Wonders_1.ShakespearesTheatre, Advances_1.Electronics],
    ].map(([WonderType, ObsoletingAdvance]) => new Complete_1.default(new Criterion_1.default(() => wonderRegistry
        .entries()
        .some((wonder) => wonder instanceof WonderType)), new Criterion_1.default((playerResearch, advance) => advance instanceof ObsoletingAdvance), new Effect_1.default(() => {
        const [wonder] = wonderRegistry.filter((wonder) => wonder instanceof WonderType);
        ruleRegistry.process(Obsolete_1.default, wonder, wonder.city());
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=research-complete.js.map