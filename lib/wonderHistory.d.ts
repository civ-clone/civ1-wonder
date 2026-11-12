import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import Player from '@civ-clone/core-player/Player';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { isStanding } from '@civ-clone/base-wonder/lib/isStanding';
/**
 * This package's Wonders in the original's order, its Wonders of the World report and `marvel_site` indexes 1 to 21:
 *  `achievement_names` (`GAME.H` 24: `#define achievement_names (improvements + 24)`), from Pyramids (`GAME.C`
 *  `improvements[25]`) to the Cure for Cancer (`improvements[45]`).
 */
export declare const WONDERS_IN_ORIGINAL_ORDER: (typeof Wonder)[];
/** `standing`: in a city now. `lost`: built, then lost with its city. `never`: never built. */
export type WonderState = 'standing' | 'lost' | 'never';
export interface IWonderStatus {
  /** The Wonder this is about. */
  type: typeof Wonder;
  state: WonderState;
  /** The Wonder itself: the standing one, the last one lost, or `null` when it was never built. */
  wonder: Wonder | null;
  /**
   * The city it stands in, or for a lost Wonder the city it was lost with, which is destroyed but still has its
   *  name; `null` when it was never built.
   */
  city: City | null;
  /** Whose it is: the standing city's player (a captor, once its city is taken), or `null` when lost or never built. */
  owner: Player | null;
}
/**
 * Whether a Wonder in `wonders` stands: its city is still there (base-wonder's `isStanding`). One whose city is
 *  destroyed is lost, nobody's, and does nothing, as v474.05's `0x80` is (`civ_wonder`, `CITYMGT.C` 1999-2011, counts
 *  a Wonder for a player only through the owner of the city `marvel_site` holds, and `0x80` holds none).
 *  `Rules/City/destroyed` unregisters a Wonder with its city, but a Wonder completed in a city destroyed earlier that
 *  turn, as one starved away on its food (civ-clone/web-renderer#975), was registered after that and stays in
 *  `wonders`. `civ1-player` no longer processes a destroyed city's shields, so nothing completes in one, but a game
 *  saved before that may hold such a Wonder: what reads `wonders` for one standing asks this as well.
 */
export { isStanding };
/**
 * Whether `WonderType` has ever been built, by anyone: standing now, or lost with its city since. v474.05's `!= -1`
 *  readers: a Wonder is offered only while `(marvel_site - 24)[i] == -1` (`ECONOMY.C` `find_slot` 231) and
 *  completes only then (`CITYMGT.C` `city_process` 731); Nuclear units need `marvel_site[17] != -1` (`ECONOMY.C`
 *  `find_slot` 190), spaceship parts `marvel_site[19] != -1` (`ECONOMY.C` `find_slot` 220). Cheap enough to ask from
 *  inside `CityBuild#available()`: an index lookup, then (only for a Wonder never built) a look through the standing
 *  Wonders.
 */
export declare const everBuilt: (
  WonderType: typeof Wonder,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => boolean;
/**
 * Where `WonderType` is and whose, or that it was lost or never built. A standing Wonder wins over a lost one of the
 *  same type: a game from before civ-clone/web-renderer#971 may hold one lost and another built again since. One
 *  still in `wonders` whose city is destroyed is lost (`isStanding`, civ-clone/web-renderer#975).
 */
export declare const wonderStatus: (
  WonderType: typeof Wonder,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => IWonderStatus;
/**
 * Every Wonder ever built, standing or lost, as `wonderStatus` gives it, in the original's order
 *  (`WONDERS_IN_ORIGINAL_ORDER`, as its `wonders()` report lists them: `for (i = 1; i <= 21; i++) { if (marvel_site[i]
 *  == -1) continue; ...`). A Wonder another plugin adds comes after this package's, in the order it was first built.
 *  Not for a hot path: it looks through every improvement.
 */
export declare const wonderHistory: (
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => IWonderStatus[];
export default wonderHistory;
