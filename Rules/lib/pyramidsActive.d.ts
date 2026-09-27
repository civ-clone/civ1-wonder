import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
/**
 * The player owns the Pyramids and they aren't obsolete yet. They go obsolete
 * when anyone discovers Communism, the same point `Player/research-complete`
 * processes `Obsolete` for them.
 */
export declare const pyramidsActive: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => Criterion;
export default pyramidsActive;
