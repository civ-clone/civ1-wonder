import {
  PendingEffect,
  PendingEffectRegistry,
} from '@civ-clone/core-pending-effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Started from '@civ-clone/core-science/Rules/Started';
/** Recorded in the save in place of a closure that captured the research. */
export declare const DARWINS_VOYAGE = 'civ1-wonder:darwins-voyage';
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
export declare const spendFreeResearch: (
  playerResearch: PlayerResearch,
  pendingEffect: PendingEffect,
  pendingEffects: PendingEffectRegistry
) => void;
export declare const getRules: (
  pendingEffects?: PendingEffectRegistry
) => Started[];
export default getRules;
