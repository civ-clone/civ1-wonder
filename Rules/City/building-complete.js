"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const BulidingComplete_1 = require("@civ-clone/core-city-build/Rules/BulidingComplete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Wonders_1 = require("../../Wonders");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Started_1 = require("@civ-clone/core-science/Rules/Started");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const getRules = (cityBuildRegistry = CityBuildRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, engine = Engine_1.instance) => [
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
        const playerResearch = playerResearchRegistry.getByPlayer(cityBuild.city().player()), createOnStarted = (action) => {
            const onStarted = new Started_1.default(new Criterion_1.default((startedPlayerResearch) => startedPlayerResearch === playerResearch), new Effect_1.default(() => {
                ruleRegistry.unregister(onStarted);
                action();
            }));
            ruleRegistry.register(onStarted);
        }, completeResearch = () => {
            playerResearch.add(playerResearch.cost());
            createOnStarted(() => playerResearch.add(playerResearch.cost()));
        };
        if (playerResearch.researching() === null) {
            createOnStarted(() => completeResearch());
            return;
        }
        completeResearch();
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=building-complete.js.map