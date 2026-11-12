"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerOwnsWonder = exports.playerHasWonder = exports.cityHasWonder = void 0;
// Wonder ownership is base-wonder's: these are the same functions, kept at this path for what imports them. Obsolete
//  Wonders still exist, but no longer do anything. Nor does one whose city is destroyed, should it still be in
//  `wonders` (`isStanding`, civ-clone/web-renderer#975).
var hasWonder_1 = require("@civ-clone/base-wonder/lib/hasWonder");
Object.defineProperty(exports, "cityHasWonder", { enumerable: true, get: function () { return hasWonder_1.cityHasWonder; } });
Object.defineProperty(exports, "playerHasWonder", { enumerable: true, get: function () { return hasWonder_1.playerHasWonder; } });
Object.defineProperty(exports, "playerOwnsWonder", { enumerable: true, get: function () { return hasWonder_1.playerOwnsWonder; } });
//# sourceMappingURL=hasWonder.js.map