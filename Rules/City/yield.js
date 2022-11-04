"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const hasWonder_1 = require("../lib/hasWonder");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const hasDiscovered_1 = require("../lib/hasDiscovered");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Yield_1.default(new Priority_1.default(500), (0, hasWonder_1.cityHasWonder)(Wonders_1.Colossus, wonderRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(Advances_1.Electricity, playerResearchRegistry), new Effect_1.default((city) => {
        return new Yields_1.Trade(city
            .tilesWorked()
            .filter((tile) => tile.yields().some((tileYield) => tileYield instanceof Yields_1.Trade)).length, Wonders_1.Colossus.name);
    })),
    ...[
        [Wonders_1.HangingGardens, 1, Advances_1.Invention],
        [Wonders_1.CureForCancer, 1, null],
    ].map(([WonderType, happiness, ObsoletingAdvance]) => new Yield_1.default((0, hasWonder_1.playerHasWonder)(WonderType, wonderRegistry), (0, hasDiscovered_1.notDiscoveredByAnyPlayer)(ObsoletingAdvance, playerResearchRegistry), new Effect_1.default(() => new Yields_1.Happiness(happiness, WonderType.name)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map