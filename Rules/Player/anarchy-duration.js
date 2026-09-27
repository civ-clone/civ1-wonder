"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const AnarchyDuration_1 = require("@civ-clone/civ1-government/Rules/AnarchyDuration");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const pyramidsActive_1 = require("../lib/pyramidsActive");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    // The Pyramids' owner changes government without passing through Anarchy
    // (Rome on 640K a Day, p314-315).
    new AnarchyDuration_1.default('civ1-wonder:player/anarchy-duration/pyramids', (0, pyramidsActive_1.pyramidsActive)(playerResearchRegistry, wonderRegistry), new Effect_1.default(() => 0)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=anarchy-duration.js.map