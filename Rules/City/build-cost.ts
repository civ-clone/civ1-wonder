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
} from '../../Wonders';
import {
  BuildCost,
  buildCost,
} from '@civ-clone/core-city-build/Rules/BuildCost';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Buildable from '@civ-clone/core-city-build/Buildable';

export const getRules: () => BuildCost[] = (): BuildCost[] => [
  ...(
    [
      [ApolloProgram, 600],
      [Colossus, 200],
      [CopernicusObservatory, 300],
      [CureForCancer, 600],
      [DarwinsVoyage, 0],
      [GreatLibrary, 300],
      [GreatWall, 300],
      [HangingGardens, 300],
      [HooverDam, 600],
      [IsaacNewtonsCollege, 400],
      [JsBachsCathedral, 400],
      [Lighthouse, 200],
      [MagellansExpedition, 400],
      [ManhattanProject, 600],
      [MichelangelosChapel, 300],
      [Oracle, 300],
      [Pyramids, 300],
      [SetiProgram, 600],
      [ShakespearesTheatre, 400],
      [UnitedNations, 600],
      [WomensSuffrage, 600],
    ] as [typeof Wonder, number][]
  ).flatMap(([WonderType, cost]: [typeof Wonder, number]): BuildCost[] =>
    buildCost(WonderType as unknown as typeof Buildable, cost)
  ),
];

export default getRules;
