"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    new Build_1.Build(new Criterion_1.default((city, BuildItem) => Object.isPrototypeOf.call(Wonder_1.default, BuildItem)), new Effect_1.default((city, WonderType) => new Criterion_1.default(() => wonderRegistry.filter((wonder) => wonder instanceof WonderType).length === 0))),
    ...[
        [Wonders_1.Colossus, Advances_1.BronzeWorking],
        [Wonders_1.CopernicusObservatory, Advances_1.Astronomy],
        [Wonders_1.GreatLibrary, Advances_1.Literacy],
        [Wonders_1.GreatWall, Advances_1.Masonry],
        [Wonders_1.HangingGardens, Advances_1.Pottery],
        [Wonders_1.Lighthouse, Advances_1.MapMaking],
        [Wonders_1.MagellansExpedition, Advances_1.Navigation],
        [Wonders_1.Oracle, Advances_1.CeremonialBurial],
        [Wonders_1.Pyramids, Advances_1.Masonry],
    ].map(([UnitType, RequiredAdvance]) => new Build_1.Build(new Criterion_1.default((city, BuildItem) => BuildItem === UnitType), new Effect_1.default((city) => new Criterion_1.default(() => playerResearchRegistry
        .getByPlayer(city.player())
        .completed(RequiredAdvance))))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map