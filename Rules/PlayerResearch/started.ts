import {
  PendingEffect,
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import Advance from '@civ-clone/core-science/Advance';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Started from '@civ-clone/core-science/Rules/Started';

/** Recorded in the save in place of a closure that captured the research. */
export const DARWINS_VOYAGE = 'civ1-wonder:darwins-voyage';

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
export const spendFreeResearch = (
  playerResearch: PlayerResearch,
  pendingEffect: PendingEffect,
  pendingEffects: PendingEffectRegistry
): void => {
  const remaining = Number(pendingEffect.data().remaining);

  if (remaining <= 1) {
    pendingEffects.discharge(pendingEffect);

    return;
  }

  pendingEffect.setData({ remaining: String(remaining - 1) });
  playerResearch.add(playerResearch.cost());
};

export const getRules: (pendingEffects?: PendingEffectRegistry) => Started[] = (
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): Started[] => [
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
  new Started(
    new Criterion((playerResearch: PlayerResearch): boolean =>
      pendingEffects
        .getByTarget(playerResearch)
        .some(
          (pendingEffect: PendingEffect): boolean =>
            pendingEffect.handler() === DARWINS_VOYAGE
        )
    ),
    new Effect(
      (playerResearch: PlayerResearch, _advance: typeof Advance): void =>
        pendingEffects
          .getByTarget(playerResearch)
          .filter(
            (pendingEffect: PendingEffect): boolean =>
              pendingEffect.handler() === DARWINS_VOYAGE
          )
          .forEach((pendingEffect: PendingEffect): void =>
            spendFreeResearch(playerResearch, pendingEffect, pendingEffects)
          )
    )
  ),
];

export default getRules;
