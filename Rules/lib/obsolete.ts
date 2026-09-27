import {
  Automobile,
  Communism,
  Electricity,
  Electronics,
  Gunpowder,
  Invention,
  Magnetism,
  NuclearFission,
  Religion,
  University,
} from '@civ-clone/civ1-science/Advances';
import {
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  IsaacNewtonsCollege,
  Lighthouse,
  MichelangelosChapel,
  Oracle,
  Pyramids,
  ShakespearesTheatre,
} from '../../Wonders';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Wonder from '@civ-clone/core-wonder/Wonder';

/** Each wonder that goes obsolete, and the advance that makes it so. */
export const obsoletedBy: [typeof Wonder, typeof Advance][] = [
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
];

/**
 * A wonder is obsolete once *anyone* has discovered its obsoleting advance, not
 * just its owner. Worked out from research rather than recorded, so there's
 * nothing extra to save.
 */
export const isObsolete = (
  WonderType: typeof Wonder,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): boolean =>
  obsoletedBy.some(
    ([ObsoleteWonder, ObsoletingAdvance]): boolean =>
      ObsoleteWonder === WonderType &&
      playerResearchRegistry.some((playerResearch: PlayerResearch): boolean =>
        playerResearch.completed(ObsoletingAdvance)
      )
  );

export default isObsolete;
