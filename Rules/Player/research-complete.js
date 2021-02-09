"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Complete_1 = require("@civ-clone/core-science/Rules/Complete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Wonders_1 = require("../../Wonders");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Complete_1.default(new Criterion_1.default(() => wonderRegistry.some((wonder) => wonder instanceof Wonders_1.GreatLibrary)), new Criterion_1.default((playerResearch, completedResearch) => playerResearchRegistry.filter((playerResearch) => playerResearch.completed(completedResearch.constructor)).length >= 3), new Criterion_1.default((playerResearch, completedResearch) => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder) => wonder instanceof Wonders_1.GreatLibrary)
            .map((greatLibrary) => greatLibrary.player()), owningPlayerResearch = playerResearchRegistry.getByPlayer(owningPlayer);
        return !owningPlayerResearch.completed(completedResearch.constructor);
    }), new Effect_1.default((playerResearch, completedResearch) => {
        console.log('here1');
        const [owningPlayer] = wonderRegistry
            .filter((wonder) => wonder instanceof Wonders_1.GreatLibrary)
            .map((greatLibrary) => greatLibrary.player()), owningPlayerResearch = playerResearchRegistry.getByPlayer(owningPlayer);
        return owningPlayerResearch.addAdvance(completedResearch.constructor);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=research-complete.js.map