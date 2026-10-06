"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const BuildItem_1 = require("@civ-clone/core-city-build/BuildItem");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const WonderHelped_1 = require("@civ-clone/base-unit-action-help-build-wonder/Rules/WonderHelped");
const getRules = (cityBuildRegistry = CityBuildRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    // The Caravan adds what it cost to build (v474.05 `ShieldsCount += 10 × Cost`, 50 for a Caravan). Nothing caps it:
    //  the shields stay if the city switches production, and anything over the Wonder's cost is lost when it completes,
    //  because `CityBuild` empties the box then.
    new WonderHelped_1.default('civ1-wonder:unit/wonder-helped/add-production', new Effect_1.default((unit, city) => {
        const cost = new BuildItem_1.default(unit.constructor, city, ruleRegistry)
            .cost()
            .value();
        cityBuildRegistry
            .getByCity(city)
            .add(new Yields_1.Production(cost, unit.constructor.name));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=wonder-helped.js.map