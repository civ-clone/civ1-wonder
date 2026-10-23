import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Pacified from '@civ-clone/library-diplomacy/Rules/Player/Pacified';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry
) => Pacified[];
export default getRules;
