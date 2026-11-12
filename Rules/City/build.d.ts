import { Build } from '@civ-clone/core-city-build/Rules/Build';
import {
  Deriver,
  RequirementRegistry,
} from '@civ-clone/core-requirement/RequirementRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
/**
 * A Wonder is built once in the world, and never again, even once it is lost with its city: a state of the game, so a
 * rule written by hand. v474.05 offers a Wonder only while it has never been built (`ECONOMY.C` `find_slot` 231:
 * `if (has_tech(civ, improvements[i].prereq) && (marvel_site - 24)[i] == -1)`), and a lost one is `0x80`, not `-1`
 * (`ECONOMY.C` `vanish` 113-114). Before civ-clone/web-renderer#971 a lost Wonder could be built again.
 */
export declare const builtOnceRule: (
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => Build;
/**
 * The rule `entry` is played by: a city may build its subject only once each advance and Wonder it `requires` is held,
 * by the city's player or, for a `world` entry, by anyone (the Manhattan Project, for Nuclear units). A Wonder in a
 * `world` entry counts once it has ever been built, even if it has been lost with its city since: v474.05 offers
 * Nuclear units once the Manhattan Project has ever been built (`ECONOMY.C` `find_slot` 190:
 * `if (i == 25 && (marvel_site[17] == -1 || !has_tech(civ, 27))) continue;`), and a lost Wonder is `0x80`, not `-1`
 * (civ-clone/web-renderer#971). In a `city` or `player` entry it counts only while it stands in that city or the
 * player's, and not in a city destroyed (`isStanding`, civ-clone/web-renderer#975).
 */
export declare const buildRulesFor: (
  entry: Requirement,
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => Build[];
/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
export declare const deriveBuildRules: (
  playerResearchRegistry: PlayerResearchRegistry,
  wonderRegistry: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
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
  requirementRegistry?: RequirementRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => Build[];
export default getRules;
