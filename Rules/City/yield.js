"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.happinessWonders = exports.colossusTrade = void 0;
const RequirementRegistry_1 = require("@civ-clone/core-requirement/RequirementRegistry");
const Wonders_1 = require("../../Wonders");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const hasWonder_1 = require("../lib/hasWonder");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priority_1 = require("@civ-clone/core-rule/Priority");
/** The trade the Colossus adds to each square its city works that already gives trade. */
exports.colossusTrade = 1;
/** The happy citizen each of these adds to every city of its owner. */
exports.happinessWonders = [
    [Wonders_1.HangingGardens, 1],
    [Wonders_1.CureForCancer, 1],
];
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, requirementRegistry = RequirementRegistry_1.instance) => [
    new Yield_1.default(new Priority_1.default(500), (0, hasWonder_1.cityHasWonder)(Wonders_1.Colossus, wonderRegistry, playerResearchRegistry, requirementRegistry), new Effect_1.default((city) => {
        return new Yields_1.Trade(city
            .tilesWorked()
            .filter((tile) => tile.yields().some((tileYield) => tileYield instanceof Yields_1.Trade)).length * exports.colossusTrade, Wonders_1.Colossus.name);
    }), 
    // What it does, for the Civilopedia (civ-clone/web-renderer#1196).
    new Description_1.default({
        type: 'tile_yield',
        subject: Wonders_1.Colossus,
        yield: Yields_1.Trade,
        value: exports.colossusTrade,
        on: 'producing',
    })),
    ...exports.happinessWonders.map(([WonderType, happiness]) => new Yield_1.default((0, hasWonder_1.playerHasWonder)(WonderType, wonderRegistry, playerResearchRegistry, requirementRegistry), new Effect_1.default(() => new Yields_1.Happiness(happiness, WonderType.name)), new Description_1.default({
        type: 'happy',
        subject: WonderType,
        value: happiness,
        scope: 'player',
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map