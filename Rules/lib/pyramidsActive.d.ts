import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
/**
 * The player owns the Pyramids and they aren't obsolete yet (anyone has
 * discovered Communism).
 */
export declare const pyramidsActive: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => Criterion;
export default pyramidsActive;
