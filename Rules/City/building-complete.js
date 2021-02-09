"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const BulidingComplete_1 = require("@civ-clone/core-city-build/Rules/BulidingComplete");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const getRules = (cityBuildRegistry = CityBuildRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new BulidingComplete_1.BuildingComplete(new Criterion_1.default((cityBuild, built) => built instanceof Wonder_1.default), new Effect_1.default((cityBuild, built) => {
        const WonderType = built.constructor;
        wonderRegistry.register(built);
        cityBuildRegistry
            .filter((cityBuild) => cityBuild.building() === WonderType)
            .forEach((cityBuild) => cityBuild.revalidate());
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=building-complete.js.map