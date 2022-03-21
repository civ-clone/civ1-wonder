"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Obsolete_1 = require("@civ-clone/core-wonder/Rules/Obsolete");
const getRules = (engine = Engine_1.instance) => [
    new Obsolete_1.default(new Effect_1.default((wonder, city) => {
        engine.emit('wonder:obsolete', wonder, city);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=obsolete.js.map