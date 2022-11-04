"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notDiscoveredByPlayer = exports.notDiscoveredByAnyPlayer = exports.discoveredByPlayer = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const discoveredByPlayer = (AdvanceType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default((item) => playerResearchRegistry.getByPlayer(item.player()).completed(AdvanceType));
exports.discoveredByPlayer = discoveredByPlayer;
const notDiscoveredByAnyPlayer = (AdvanceType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default(() => AdvanceType === null ||
    !playerResearchRegistry.some((playerResearch) => playerResearch.completed(AdvanceType)));
exports.notDiscoveredByAnyPlayer = notDiscoveredByAnyPlayer;
const notDiscoveredByPlayer = (AdvanceType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default((item) => AdvanceType === null ||
    !playerResearchRegistry.getByPlayer(item.player()).completed(AdvanceType));
exports.notDiscoveredByPlayer = notDiscoveredByPlayer;
//# sourceMappingURL=hasDiscovered.js.map