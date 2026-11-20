import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import UnitYield from '@civ-clone/core-unit/Rules/Yield';
/** The moves each Wonder adds to its owner's ships. */
export declare const lighthouseMoves: number, magellansMoves: number;
export declare const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  requirementRegistry?: RequirementRegistry
) => UnitYield[];
export default getRules;
