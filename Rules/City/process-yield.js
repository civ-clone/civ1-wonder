"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const wonderHistory_1 = require("../../lib/wonderHistory");
const getRules = (cityBuildRegistry = CityBuildRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    // A Wonder that has been built is never completed again (civ-clone/web-renderer#971). v474.05 checks it as the
    //  shields would complete it, and keeps the shields (`CITYMGT.C` 672-677):
    //
    //  ```c
    //  if (scratch_i > 24) {
    //      if ((marvel_site - 24)[scratch_i] == -1) {
    //          (marvel_site - 24)[scratch_i] = city;
    //          ...
    //      } else {
    //          scratch_i = -1;
    //      }
    //  ```
    //
    //  It leaves the Wonder chosen, flashing on the city screen (`CITYMGT.C` 1294) until the player changes it. Here
    //  `once` stops it being chosen, and a rival's build is dropped when the Wonder is completed
    //  (`Rules/City/building-complete`), so only a game saved before #971, with a lost Wonder part way through being
    //  built again, reaches this: the build is dropped instead (`CityBuild#revalidate`, cleared as `unavailable`, its
    //  shields kept), so a computer player's city isn't left building it for ever.
    //
    //  The only way a build completes in play is `CityBuild#check()` in `civ1-city`'s production `ProcessYield`, after
    //  this turn's shields are added; buying it and a Caravan helping build it only add shields, which that then
    //  completes. That rule is `Normal`; this is `High`, so it runs first for each city whichever package loads first.
    new ProcessYield_1.default('civ1-wonder:city/process-yield/drop-built-wonder', new High_1.default(), new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Production), new Criterion_1.default((cityYield, city) => {
        var _a, _b;
        const Item = (_b = (_a = cityBuildRegistry.getByCity(city)) === null || _a === void 0 ? void 0 : _a.building()) === null || _b === void 0 ? void 0 : _b.item();
        return (Item !== undefined &&
            Object.prototype.isPrototypeOf.call(Wonder_1.default, Item) &&
            (0, wonderHistory_1.everBuilt)(Item, wonderRegistry, cityImprovementRegistry));
    }), new Effect_1.default((cityYield, city) => cityBuildRegistry.getByCity(city).revalidate())),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=process-yield.js.map