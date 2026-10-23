import { Requirement, Target } from '@civ-clone/core-requirement/Requirement';
import {
  Deriver,
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import { isObsolete } from '../lib/obsolete';
import { obsoletedBy } from '../../Requirements';
import { GreatLibrary } from '../../Wonders';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Complete from '@civ-clone/core-science/Rules/Complete';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Obsolete from '@civ-clone/core-wonder/Rules/Obsolete';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { notDiscoveredByAnyOtherPlayer } from '../lib/hasDiscovered';

/**
 * The rule `entry` is played by: the first time anyone discovers the advance that makes its Wonder obsolete, the Wonder
 * is announced `Obsolete`. A Wonder is obsoleted by one advance, so an entry naming more is refused.
 */
export const obsoleteRulesFor = (
  entry: Requirement,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Complete[] => {
  if (entry.relation !== 'obsoletedBy') {
    return [];
  }

  if (entry.targets.length !== 1) {
    throw new TypeError(
      `'${entry.id}': a Wonder is made obsolete by one advance, not ${entry.targets.length}.`
    );
  }

  const WonderType = entry.subject as typeof Wonder,
    [ObsoletingAdvance] = entry.targets as Target[] as (typeof Advance)[];

  return [
    new Complete(
      entry.id,
      new Criterion(() =>
        wonderRegistry
          .entries()
          .some((wonder: Wonder) => wonder instanceof WonderType)
      ),
      new Criterion(
        (playerResearch: PlayerResearch, advance: Advance) =>
          advance instanceof ObsoletingAdvance
      ),
      // Only the first discovery makes a wonder obsolete; later ones would process `Obsolete` again.
      notDiscoveredByAnyOtherPlayer(ObsoletingAdvance, playerResearchRegistry),
      new Effect(() => {
        const [wonder] = wonderRegistry.filter(
          (wonder: Wonder) => wonder instanceof WonderType
        );

        ruleRegistry.process(Obsolete, wonder, wonder.city());
      })
    ),
  ];
};

/** What `registerRules` gives the game's `requirements` to make each obsolete entry's rule with. */
export const deriveObsoleteRules =
  (
    playerResearchRegistry: PlayerResearchRegistry,
    ruleRegistry: RuleRegistry,
    wonderRegistry: WonderRegistry
  ): Deriver =>
  (entry: Requirement): Complete[] =>
    obsoleteRulesFor(
      entry,
      playerResearchRegistry,
      ruleRegistry,
      wonderRegistry
    );

/** The Great Library's rule: the hand-written part of what happens when research completes. */
export const greatLibraryRules = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): Complete[] => [
  new Complete(
    new Criterion(
      (): boolean =>
        wonderRegistry.some(
          (wonder: Wonder): boolean => wonder instanceof GreatLibrary
        ) &&
        !isObsolete(GreatLibrary, playerResearchRegistry, requirementRegistry)
    ),
    new Criterion(
      (playerResearch: PlayerResearch, completedResearch: Advance): boolean => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder: Wonder): boolean => wonder instanceof GreatLibrary)
            .map(
              (greatLibrary: GreatLibrary): Player =>
                greatLibrary.city().player()
            ),
          owningPlayerResearch =
            playerResearchRegistry.getByPlayer(owningPlayer);

        return !owningPlayerResearch.completed(completedResearch.sourceClass());
      }
    ),
    new Criterion(
      (playerResearch: PlayerResearch, completedResearch: Advance): boolean =>
        playerResearchRegistry.filter(
          (playerResearch: PlayerResearch): boolean =>
            playerResearch.completed(completedResearch.sourceClass())
        ).length >= 3
    ),
    new Effect(
      (playerResearch: PlayerResearch, completedResearch: Advance): void => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder: Wonder): boolean => wonder instanceof GreatLibrary)
            .map(
              (greatLibrary: GreatLibrary): Player =>
                greatLibrary.city().player()
            ),
          owningPlayerResearch =
            playerResearchRegistry.getByPlayer(owningPlayer);

        return owningPlayerResearch.addAdvance(completedResearch.sourceClass());
      }
    )
  ),
];

/**
 * Every rule about what happens when research completes, as `registerRules` registers them: the Great Library's, then
 * one for each of `Requirements`' obsolete entries. For a rule registry without a game's `requirements` (tests).
 */
export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry
) => Complete[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): Complete[] => [
  ...greatLibraryRules(
    playerResearchRegistry,
    ruleRegistry,
    wonderRegistry,
    requirementRegistry
  ),
  ...obsoletedBy.flatMap((entry: Requirement): Complete[] =>
    obsoleteRulesFor(
      entry,
      playerResearchRegistry,
      ruleRegistry,
      wonderRegistry
    )
  ),
];

export default getRules;
