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
} from './Wonders';
import {
  Astronomy,
  Automobile,
  BronzeWorking,
  Communism,
  Computers,
  Electricity,
  Electronics,
  GeneticEngineering,
  Gunpowder,
  Industrialization,
  Invention,
  Literacy,
  Magnetism,
  MapMaking,
  Masonry,
  Medicine,
  Mysticism,
  Navigation,
  NuclearFission,
  Pottery,
  Railroad,
  Religion,
  SpaceFlight,
  TheoryOfGravity,
  University,
} from '@civ-clone/civ1-science/Advances';
import { Requirement, table } from '@civ-clone/core-requirement/Requirement';
import { Nuclear } from '@civ-clone/civ1-unit/Units';

// What Civilization's Wonders need, what makes them obsolete, and the units they make buildable, as the entries
//  `Rules/City/build` and `Rules/Player/research-complete` make their rules from (civ-clone/web-renderer#37).
//  `registerRules` adds them to the game's `requirements`, where `isObsolete` reads them.

/** The advance a city's player needs before it can build each Wonder: one rule each. */
export const requiresAdvance: Requirement[] = table(
  'civ1-wonder:city/build/requires-advance',
  'requires',
  [
    [Colossus, BronzeWorking],
    [CopernicusObservatory, Astronomy],
    [GreatLibrary, Literacy],
    [GreatWall, Masonry],
    [HangingGardens, Pottery],
    [Lighthouse, MapMaking],
    [MagellansExpedition, Navigation],
    [Oracle, Mysticism],
    [Pyramids, Masonry],
    [ApolloProgram, SpaceFlight],
    [CureForCancer, GeneticEngineering],
    [DarwinsVoyage, Railroad],
    [HooverDam, Electronics],
    [IsaacNewtonsCollege, TheoryOfGravity],
    [JsBachsCathedral, Religion],
    [ManhattanProject, NuclearFission],
    [MichelangelosChapel, Religion],
    [SetiProgram, Computers],
    [ShakespearesTheatre, Medicine],
    [UnitedNations, Communism],
    [WomensSuffrage, Industrialization],
  ]
);

/** Nuclear units need the Manhattan Project, built by anyone in the world (civ-clone/web-renderer#129): one rule. */
export const requiresWonder: Requirement[] = table(
  'civ1-wonder:city/build/requires-wonder',
  'requires',
  [[Nuclear, ManhattanProject]],
  { range: 'world' }
);

/**
 * The advance that makes each Wonder obsolete, once *anyone* has discovered it, not just its owner: one rule each, which
 * announces it the first time. `isObsolete` reads these.
 */
export const obsoletedBy: Requirement[] = table(
  'civ1-wonder:wonder/obsolete',
  'obsoletedBy',
  [
    [Colossus, Electricity],
    [CopernicusObservatory, Automobile],
    [GreatLibrary, University],
    [GreatWall, Gunpowder],
    [HangingGardens, Invention],
    [IsaacNewtonsCollege, NuclearFission],
    [Lighthouse, Magnetism],
    [MichelangelosChapel, Communism],
    [Oracle, Religion],
    [Pyramids, Communism],
    [ShakespearesTheatre, Electronics],
  ],
  { range: 'world' }
);

/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
export const buildRequirements: Requirement[] = [
  ...requiresAdvance,
  ...requiresWonder,
];

export default buildRequirements;
