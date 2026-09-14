"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.spendFreeResearch = exports.DARWINS_VOYAGE = void 0;
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Started_1 = require("@civ-clone/core-science/Rules/Started");
/** Recorded in the save in place of a closure that captured the research. */
exports.DARWINS_VOYAGE = 'civ1-wonder:darwins-voyage';
/**
 * Spend one of the free research completions Darwin's Voyage owes.
 *
 * Exported because `City/building-complete` needs it too: if the player is
 * already researching when the wonder finishes, one is spent immediately
 * rather than waiting for the next thing they start.
 *
 * The last one is `discharge`d, which removes the debt and runs the handler.
 * The others are applied directly and the remainder written back, because
 * discharging would forget a debt that is only partly paid — and a save taken
 * between the two would then lose the second completion.
 */
const spendFreeResearch = (playerResearch, pendingEffect, pendingEffects) => {
    const remaining = Number(pendingEffect.data().remaining);
    if (remaining <= 1) {
        pendingEffects.discharge(pendingEffect);
        return;
    }
    pendingEffect.setData({ remaining: String(remaining - 1) });
    playerResearch.add(playerResearch.cost());
};
exports.spendFreeResearch = spendFreeResearch;
const getRules = (pendingEffects = core_pending_effect_1.instance) => [
    // Registered once, at import, like every other rule.
    //
    // It used to be a one-shot registered *inside* an `Effect`, which registered
    // another one-shot inside its own effect, each closing over the
    // `PlayerResearch` it applied to. That is why a save taken between building
    // the wonder and the next research lost the free completions entirely: the
    // only record of them was a closure in the rule registry.
    //
    // What the save records now is a `PendingEffect` — "this research is owed
    // two completions" — and this rule is the "when": it fires on every research
    // start and does nothing unless that research is owed something.
    new Started_1.default(new Criterion_1.default((playerResearch) => pendingEffects
        .getByTarget(playerResearch)
        .some((pendingEffect) => pendingEffect.handler() === exports.DARWINS_VOYAGE)), new Effect_1.default((playerResearch, _advance) => pendingEffects
        .getByTarget(playerResearch)
        .filter((pendingEffect) => pendingEffect.handler() === exports.DARWINS_VOYAGE)
        .forEach((pendingEffect) => (0, exports.spendFreeResearch)(playerResearch, pendingEffect, pendingEffects)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=started.js.map