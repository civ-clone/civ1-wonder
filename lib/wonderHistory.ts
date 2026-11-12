import {
  ApolloProgram,
  Colossus,
  CopernicusObservatory,
  CureForCancer,
  DarwinsVoyage,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  HooverDam,
  IsaacNewtonsCollege,
  JsBachsCathedral,
  Lighthouse,
  MagellansExpedition,
  ManhattanProject,
  MichelangelosChapel,
  Oracle,
  Pyramids,
  SetiProgram,
  ShakespearesTheatre,
  UnitedNations,
  WomensSuffrage,
} from '../Wonders';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Player from '@civ-clone/core-player/Player';
import Wonder from '@civ-clone/core-wonder/Wonder';

// Whether a Wonder stands, was lost, or was never built, worked out from the two registries a game already saves, so
//  nothing new is saved (civ-clone/web-renderer#971):
//
// - `wonders` holds each Wonder while it stands (`Rules/City/building-complete` registers it; `Rules/City/destroyed`
//   unregisters it with its city). A captured city's Wonder stays, and its owner is the captor.
// - `cityImprovements` holds every Wonder ever built, as every improvement is registered when it is created
//   (`civ1-city-improvement`'s `Created` rule); one lost with its city stays, flagged `destroyed()`.
//
// v474.05 keeps one entry for each Wonder, `marvel_site` (`GLOBALS.C`: `int marvel_site[22]; /* city holding each
//  wonder (-1 none) */`): the city holding it, -1 for never built, and 0x80 once its city is destroyed (`ECONOMY.C`
//  94-96: `for (j = 1; j <= 21; j++) if (marvel_site[j] == idx) marvel_site[j] = 0x80;`). What reads `!= -1` reads
//  "ever built" (`everBuilt`); what reads the city's owner reads "standing, and whose" (`wonderStatus`), for which a
//  lost Wonder is nobody's (`REPORTS.C` `wonders()`: `strcat(msgtext, " (Destroyed)"); owner = 0;`).
//
// Whether a standing Wonder is of a type is `instanceof`, as the rules reading `wonders` always asked; whether one
//  was ever built also asks `cityImprovements.getByType`, which is by exact constructor: a plugin's subclass of a
//  Wonder, once lost, counts only as itself.

/**
 * This package's Wonders in the original's order, its Wonders of the World report and `marvel_site` indexes 1 to 21:
 *  `achievement_names` (`GAME.H`: `#define achievement_names (improvements + 24)`), from Pyramids (`GAME.C`
 *  `improvements[25]`) to the Cure for Cancer (`improvements[45]`).
 */
export const WONDERS_IN_ORIGINAL_ORDER: (typeof Wonder)[] = [
  Pyramids,
  HangingGardens,
  Colossus,
  Lighthouse,
  GreatLibrary,
  Oracle,
  GreatWall,
  MagellansExpedition,
  MichelangelosChapel,
  CopernicusObservatory,
  ShakespearesTheatre,
  IsaacNewtonsCollege,
  JsBachsCathedral,
  DarwinsVoyage,
  HooverDam,
  WomensSuffrage,
  ManhattanProject,
  UnitedNations,
  ApolloProgram,
  SetiProgram,
  CureForCancer,
];

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

const isOfType =
  (WonderType: typeof Wonder) =>
  (wonder: Wonder): boolean =>
    wonder instanceof WonderType;

/**
 * Whether `WonderType` has ever been built, by anyone: standing now, or lost with its city since. v474.05's `!= -1`
 *  readers: a Wonder is offered only while `(marvel_site - 24)[i] == -1` (`ECONOMY.C` 213) and completes only then
 *  (`CITYMGT.C` 673); Nuclear units need `marvel_site[17] != -1` (`ECONOMY.C` 172), spaceship parts
 *  `marvel_site[19] != -1` (`ECONOMY.C` 202). Cheap enough to ask from inside `CityBuild#available()`: an index
 *  lookup, then (only for a Wonder never built) a look through the standing Wonders.
 */
export const everBuilt = (
  WonderType: typeof Wonder,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): boolean =>
  cityImprovementRegistry.getByType(WonderType, true).length > 0 ||
  wonderRegistry.some(isOfType(WonderType));

/**
 * Where `WonderType` is and whose, or that it was lost or never built. A standing Wonder wins over a lost one of the
 *  same type: a game from before civ-clone/web-renderer#971 may hold one lost and another built again since.
 */
export const wonderStatus = (
  WonderType: typeof Wonder,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): IWonderStatus => {
  const [standing] = wonderRegistry.filter(isOfType(WonderType));

  if (standing) {
    return {
      type: WonderType,
      state: 'standing',
      wonder: standing,
      city: standing.city(),
      owner: standing.city().player(),
    };
  }

  const lost = cityImprovementRegistry.getByType(WonderType, true).pop() as
    | Wonder
    | undefined;

  if (lost) {
    return {
      type: WonderType,
      state: 'lost',
      wonder: lost,
      city: lost.city(),
      owner: null,
    };
  }

  return {
    type: WonderType,
    state: 'never',
    wonder: null,
    city: null,
    owner: null,
  };
};

/**
 * Every Wonder ever built, standing or lost, as `wonderStatus` gives it, in the original's order
 *  (`WONDERS_IN_ORIGINAL_ORDER`, as its `wonders()` report lists them: `for (i = 1; i <= 21; i++) { if (marvel_site[i]
 *  == -1) continue; ...`). A Wonder another plugin adds comes after this package's, in the order it was first built.
 *  Not for a hot path: it looks through every improvement.
 */
export const wonderHistory = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): IWonderStatus[] => {
  const types: (typeof Wonder)[] = [];

  [...cityImprovementRegistry.entries(), ...wonderRegistry.entries()].forEach(
    (improvement: CityImprovement): void => {
      if (!(improvement instanceof Wonder)) {
        return;
      }

      const WonderType = improvement.constructor as typeof Wonder;

      if (!types.includes(WonderType)) {
        types.push(WonderType);
      }
    }
  );

  const rank = (WonderType: typeof Wonder): number => {
    const index = WONDERS_IN_ORIGINAL_ORDER.indexOf(WonderType);

    return index === -1 ? WONDERS_IN_ORIGINAL_ORDER.length : index;
  };

  return types
    .map((WonderType: typeof Wonder, index: number) => ({ WonderType, index }))
    .sort(
      (a, b) => rank(a.WonderType) - rank(b.WonderType) || a.index - b.index
    )
    .map(
      ({ WonderType }): IWonderStatus =>
        wonderStatus(WonderType, wonderRegistry, cityImprovementRegistry)
    );
};

export default wonderHistory;
