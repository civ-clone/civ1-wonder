"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The rules here read when a Wonder is obsolete from the game's requirements (civ-clone/web-renderer#37). The suites
//  build rules straight from the factories, which default to the module registries, `defaultGame`'s, so they need
//  this package registered there, as loading it as a plugin does: its obsolete entries are then in `defaultGame`'s
//  requirements. Registering is the module's import side effect, so it happens once however many suites import this,
//  and a suite importing `registerRules` itself adds nothing more. No suite uses `defaultGame`'s rules, so the rules
//  that registers don't reach any suite.
require("../../registerRules");
//# sourceMappingURL=requirements.js.map