"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Governments_1 = require("@civ-clone/civ1-government/Governments");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Availability_1 = require("@civ-clone/core-government/Rules/Availability");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const pyramidsActive_1 = require("../lib/pyramidsActive");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => {
    const hasPyramids = (0, pyramidsActive_1.pyramidsActive)(playerResearchRegistry, wonderRegistry);
    return [
        // The Pyramids' owner can choose any of the five governments, whichever
        // advances they have (Rome on 640K a Day, p314-315).
        new Availability_1.default('civ1-wonder:governments/availability/pyramids', new Criterion_1.default((GovernmentType) => [Governments_1.Communism, Governments_1.Democracy, Governments_1.Despotism, Governments_1.Monarchy, Governments_1.Republic].includes(GovernmentType)), new Criterion_1.default((GovernmentType, player) => hasPyramids.validate(player))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=availability.js.map