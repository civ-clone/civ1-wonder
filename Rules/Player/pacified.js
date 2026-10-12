"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Wonders_1 = require("../../Wonders");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Pacified_1 = require("@civ-clone/library-diplomacy/Rules/Player/Pacified");
const hasWonder_1 = require("../lib/hasWonder");
// Every other leader is pacified towards the owner of the Great Wall, until anyone discovers Gunpowder, or of the
//  United Nations: in a parley they always end by offering it a peace treaty (Rome on 640K a Day, pp. 124, 296-297).
//  In v474.05 neither wonder lets the leader be hostile in the human's parley (`MeetWithKing.cs`), and the Great Wall
//  keeps computer players who meet from going to war with its owner (`Segment_2517.cs` `F0_2517_0737`). Here both act
//  in every negotiation, since computer players meet through the same one (civ-clone/web-renderer#30).
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) => [
    ['great-wall', Wonders_1.GreatWall],
    ['united-nations', Wonders_1.UnitedNations],
].map(([key, WonderType]) => new Pacified_1.default(`civ1-wonder:player/pacified/${key}`, new Criterion_1.default((player, other) => player !== other &&
    (0, hasWonder_1.playerOwnsWonder)(other, WonderType, wonderRegistry, playerResearchRegistry)), new Effect_1.default(() => true)));
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pacified.js.map