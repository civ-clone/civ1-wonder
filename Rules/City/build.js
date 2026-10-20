"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const LandMassRegistry_1 = require("@civ-clone/core-world/LandMassRegistry");
const onWonderLandMass_1 = require("../lib/onWonderLandMass");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const Units_1 = require("@civ-clone/civ1-unit/Units");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, landMassRegistry = LandMassRegistry_1.instance) => [
    new Build_1.Build(Wonder_1.default, new Criterion_1.default((city, BuildItem) => Object.isPrototypeOf.call(Wonder_1.default, BuildItem)), new Effect_1.default((city, WonderType) => new Criterion_1.default(() => wonderRegistry.filter((wonder) => wonder instanceof WonderType).length === 0))),
    ...[
        [Wonders_1.Colossus, Advances_1.BronzeWorking],
        [Wonders_1.CopernicusObservatory, Advances_1.Astronomy],
        [Wonders_1.GreatLibrary, Advances_1.Literacy],
        [Wonders_1.GreatWall, Advances_1.Masonry],
        [Wonders_1.HangingGardens, Advances_1.Pottery],
        [Wonders_1.Lighthouse, Advances_1.MapMaking],
        [Wonders_1.MagellansExpedition, Advances_1.Navigation],
        [Wonders_1.Oracle, Advances_1.Mysticism],
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
    ].map(([WonderType, RequiredAdvance]) => new Build_1.Build(WonderType, new Criterion_1.default((city, BuildItem) => BuildItem === WonderType), new Effect_1.default((city) => new Criterion_1.default(() => playerResearchRegistry
        .getByPlayer(city.player())
        .completed(RequiredAdvance))))),
    ...[[Units_1.Nuclear, Wonders_1.ManhattanProject]].map(([UnitType, RequiredWonder]) => new Build_1.Build(UnitType, new Criterion_1.default((city, BuildItem) => BuildItem === UnitType), new Effect_1.default(() => new Criterion_1.default(() => wonderRegistry.some((wonder) => wonder instanceof RequiredWonder))))),
    // As v474.05's production menu, a city that Hoover Dam already acts as a plant for isn't offered one (OpenCivOne's
    //  decompile, `Segment_1ade.cs` `F0_1ade_0421`).
    ...[CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant].map((Plant) => {
        const hooverDam = (0, onWonderLandMass_1.onWonderLandMass)(Wonders_1.HooverDam, wonderRegistry, playerResearchRegistry, landMassRegistry);
        return new Build_1.Build(Plant, new Criterion_1.default((city, BuildItem) => BuildItem === Plant), new Effect_1.default((city) => new Criterion_1.default(() => !hooverDam.validate(city))));
    }),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map