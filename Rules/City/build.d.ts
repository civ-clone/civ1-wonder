import { Build } from '@civ-clone/core-city-build/Rules/Build';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  landMassRegistry?: LandMassRegistry
) => Build[];
export default getRules;
