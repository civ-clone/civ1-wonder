"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const started_1 = require("../PlayerResearch/started");
const BulidingComplete_1 = require("@civ-clone/core-city-build/Rules/BulidingComplete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Wonders_1 = require("../../Wonders");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const getRules = (cityBuildRegistry = CityBuildRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, engine = Engine_1.instance, pendingEffects = core_pending_effect_1.instance) => [
    new BulidingComplete_1.default(new Criterion_1.default((cityBuild, built) => built instanceof Wonder_1.default), new Effect_1.default((cityBuild, built) => {
        const WonderType = built.constructor;
        wonderRegistry.register(built);
        cityBuildRegistry
            .filter((cityBuild) => {
            var _a;
            return ((_a = cityBuild.building()) === null || _a === void 0 ? void 0 : _a.item()) ===
                WonderType;
        })
            .forEach((cityBuild) => cityBuild.revalidate());
    })),
    new BulidingComplete_1.default(new Criterion_1.default((cityBuild, built) => built instanceof Wonder_1.default), new Effect_1.default((cityBuild, built) => {
        engine.emit('wonder:built', built, cityBuild.city());
    })),
    new BulidingComplete_1.default(new Criterion_1.default((cityBuild, built) => built instanceof Wonders_1.DarwinsVoyage), new Effect_1.default((cityBuild) => {
        const playerResearch = playerResearchRegistry.getByPlayer(cityBuild.city().player()), 
        // Two free research completions, recorded as a debt against the
        // player's research rather than as a pair of self-registering one-shot
        // rules. The old version kept the only record of them in a closure, so
        // a save taken between finishing the wonder and starting the next
        // research lost them with no symptom — which is the bug
        // `01-constraints.md` §4 describes.
        pendingEffect = new core_pending_effect_1.PendingEffect(started_1.DARWINS_VOYAGE, playerResearch, {
            remaining: '2',
        });
        pendingEffects.handler(started_1.DARWINS_VOYAGE, (discharged) => discharged.target().add(discharged.target().cost()));
        pendingEffects.register(pendingEffect);
        // Already researching something, so one is spent now rather than
        // waiting for the next thing they start. `Rules/PlayerResearch/started`
        // spends the rest, one per research start.
        if (playerResearch.researching() !== null) {
            (0, started_1.spendFreeResearch)(playerResearch, pendingEffect, pendingEffects);
        }
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=building-complete.js.map