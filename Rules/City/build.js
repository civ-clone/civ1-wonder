"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
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
        [Wonders_1.ApolloProgram, Advances_1.SpaceFlight],
        [Wonders_1.CureForCancer, Advances_1.GeneticEngineering],
        [Wonders_1.DarwinsVoyage, Advances_1.Railroad],
        [Wonders_1.HooverDam, Advances_1.Electronics],
        [Wonders_1.IsaacNewtonsCollege, Advances_1.TheoryOfGravity],
        [Wonders_1.JsBachsCathedral, Advances_1.Religion],
        [Wonders_1.ManhattanProject, Advances_1.NuclearFission],
        [Wonders_1.MichelangelosChapel, Advances_1.Religion],
        [Wonders_1.SetiProgram, Advances_1.Computers],
        [Wonders_1.ShakespearesTheatre, Advances_1.Medicine],
        [Wonders_1.UnitedNations, Advances_1.Communism],
        [Wonders_1.WomensSuffrage, Advances_1.Industrialization],
    ].map(([UnitType, RequiredAdvance]) => new Build_1.Build(new Criterion_1.default((city, BuildItem) => BuildItem === UnitType), new Effect_1.default((city) => new Criterion_1.default(() => playerResearchRegistry
        .getByPlayer(city.player())
        .completed(RequiredAdvance))))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map