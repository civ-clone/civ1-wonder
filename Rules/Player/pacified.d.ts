import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Pacified from '@civ-clone/library-diplomacy/Rules/Player/Pacified';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry,
  clientRegistry?: ClientRegistry
) => Pacified[];
export default getRules;
