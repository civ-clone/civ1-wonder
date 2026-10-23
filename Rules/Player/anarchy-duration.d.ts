import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import AnarchyDuration from '@civ-clone/civ1-government/Rules/AnarchyDuration';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry
) => AnarchyDuration[];
export default getRules;
