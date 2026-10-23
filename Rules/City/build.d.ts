import { Build } from '@civ-clone/core-city-build/Rules/Build';
import {
  Deriver,
  RequirementRegistry,
} from '@civ-clone/core-requirement/RequirementRegistry';
import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
/** A Wonder is built once in the world: a state of the game, so a rule written by hand. */
export declare const builtOnceRule: (wonderRegistry?: WonderRegistry) => Build;
/**
 * The rule `entry` is played by: a city may build its subject only once its player has discovered each advance it
 * `requires`, and once each Wonder it `requires` has been built by anyone (the Manhattan Project, for Nuclear units).
 */
export declare const buildRulesFor: (
  entry: Requirement,
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => Build[];
/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
export declare const deriveBuildRules: (
  playerResearchRegistry: PlayerResearchRegistry,
  wonderRegistry: WonderRegistry
) => Deriver;
/**
 * As v474.05's production menu, a city that Hoover Dam already acts as a plant for isn't offered one (OpenCivOne's
 * decompile, `Segment_1ade.cs` `F0_1ade_0421`).
 */
export declare const hooverDamPlantRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => Build[];
/**
 * Every rule about building Wonders, and what they make buildable or not, as `registerRules` registers them: built
 * once, one for each of `Requirements`' build entries, then Hoover Dam's plants. For a rule registry without a game's
 * `requirements` (tests): a game's are registered through `game.requirements`, so a plugin can change an entry and its
 * rule together.
 */
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => Build[];
export default getRules;
