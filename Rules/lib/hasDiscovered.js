"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notDiscoveredByPlayer = exports.notDiscoveredByAnyOtherPlayer = exports.notDiscoveredByAnyPlayer = exports.discoveredByPlayer = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const discoveredByPlayer = (AdvanceType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default((item) => playerResearchRegistry.getByPlayer(item.player()).completed(AdvanceType));
exports.discoveredByPlayer = discoveredByPlayer;
const notDiscoveredByAnyPlayer = (AdvanceType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default(() => AdvanceType === null ||
    !playerResearchRegistry.some((playerResearch) => playerResearch.completed(AdvanceType)));
exports.notDiscoveredByAnyPlayer = notDiscoveredByAnyPlayer;
// For a `Complete` rule: true only for the first player to discover `AdvanceType`, because by the time `Complete` is
//  processed the discovering player's research already includes it. This is the moment `notDiscoveredByAnyPlayer`
//  stops holding.
const notDiscoveredByAnyOtherPlayer = (AdvanceType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default((discoveringPlayerResearch) => !playerResearchRegistry.some((playerResearch) => playerResearch !== discoveringPlayerResearch &&
    playerResearch.completed(AdvanceType)));
exports.notDiscoveredByAnyOtherPlayer = notDiscoveredByAnyOtherPlayer;
const notDiscoveredByPlayer = (AdvanceType, playerResearchRegistry = PlayerResearchRegistry_1.instance) => new Criterion_1.default((item) => AdvanceType === null ||
    !playerResearchRegistry.getByPlayer(item.player()).completed(AdvanceType));
exports.notDiscoveredByPlayer = notDiscoveredByPlayer;
//# sourceMappingURL=hasDiscovered.js.map