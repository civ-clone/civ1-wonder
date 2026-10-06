"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Action_1 = require("@civ-clone/core-unit/Rules/Action");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Units_1 = require("@civ-clone/civ1-unit/Units");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Actions_1 = require("@civ-clone/civ1-unit/Actions");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const getRules = (cityRegistry = CityRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    // A Caravan can help build a Wonder in one of its owner's cities, whichever city it comes from (v474.05
    //  `PlayerTurn.cs` L1802-L1890, civ-clone/web-renderer#57).
    new Action_1.Action('civ1-wonder:unit/action/help-build-wonder', Action_1.isNeighbouringTile, Action_1.hasMovesLeft, new Criterion_1.default((unit) => unit instanceof Units_1.Caravan), new Criterion_1.default((unit, to) => { var _a; return ((_a = cityRegistry.getByTile(to)) === null || _a === void 0 ? void 0 : _a.player()) === unit.player(); }), new Criterion_1.default((unit, to) => {
        const building = cityBuildRegistry
            .getByCity(cityRegistry.getByTile(to))
            .building();
        return (building !== null &&
            Object.prototype.isPrototypeOf.call(Wonder_1.default, building.item()));
    }), new Effect_1.default((unit, to, from = unit.tile()) => new Actions_1.HelpBuildWonder(from, to, unit, cityRegistry.getByTile(to), ruleRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=action.js.map