"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const AnarchyDuration_1 = require("@civ-clone/civ1-government/Rules/AnarchyDuration");
const Description_1 = require("@civ-clone/core-rule/Description");
const Wonders_1 = require("../../Wonders");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const pyramidsActive_1 = require("../lib/pyramidsActive");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [
    // The Pyramids' owner changes government without passing through Anarchy
    // (Rome on 640K a Day, p314-315).
    new AnarchyDuration_1.default('civ1-wonder:player/anarchy-duration/pyramids', (0, pyramidsActive_1.pyramidsActive)(playerResearchRegistry, wonderRegistry, requirementRegistry), new Effect_1.default(() => 0), 
    // What it does, for the Civilopedia (civ-clone/web-renderer#1196).
    new Description_1.default({ type: 'no_anarchy', subject: Wonders_1.Pyramids })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=anarchy-duration.js.map