import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import PollutionDivisor from '@civ-clone/civ1-city-improvement/Rules/PollutionDivisor';
export declare const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  landMassRegistry?: LandMassRegistry
) => PollutionDivisor[];
export default getRules;
