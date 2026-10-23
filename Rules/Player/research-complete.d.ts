import { Requirement } from '@civ-clone/core-requirement/Requirement';
import {
  Deriver,
  RequirementRegistry,
} from '@civ-clone/core-requirement/RequirementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Complete from '@civ-clone/core-science/Rules/Complete';
/**
 * The rule `entry` is played by: the first time anyone discovers the advance that makes its Wonder obsolete, the Wonder
 * is announced `Obsolete`. A Wonder is obsoleted by one advance, so an entry naming more is refused.
 */
export declare const obsoleteRulesFor: (
  entry: Requirement,
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry
) => Complete[];
/** What `registerRules` gives the game's `requirements` to make each obsolete entry's rule with. */
export declare const deriveObsoleteRules: (
  playerResearchRegistry: PlayerResearchRegistry,
  ruleRegistry: RuleRegistry,
  wonderRegistry: WonderRegistry
) => Deriver;
/** The Great Library's rule: the hand-written part of what happens when research completes. */
export declare const greatLibraryRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry
) => Complete[];
/**
 * Every rule about what happens when research completes, as `registerRules` registers them: the Great Library's, then
 * one for each of `Requirements`' obsolete entries. For a rule registry without a game's `requirements` (tests).
 */
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry
) => Complete[];
export default getRules;
