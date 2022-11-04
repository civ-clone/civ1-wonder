"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCityImprovement = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const hasCityImprovement = (CityImprovementType, cityImprovementRegistry = CityImprovementRegistry_1.instance) => new Criterion_1.default((city) => cityImprovementRegistry
    .getByCity(city)
    .some((cityImprovement) => cityImprovement instanceof CityImprovementType));
exports.hasCityImprovement = hasCityImprovement;
//# sourceMappingURL=hasCityImprovement.js.map