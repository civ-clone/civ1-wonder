import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import PollutionDivisor from '@civ-clone/civ1-city-improvement/Rules/PollutionDivisor';
/** Hoover Dam divides the shields that count towards pollution by this, as a plant does. */
export declare const hooverPollutionDivisor: number;
export declare const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => PollutionDivisor[];
export default getRules;
