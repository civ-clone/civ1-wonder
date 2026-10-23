import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import {
  LandMassRegistry,
  instance as landMassRegistryInstance,
} from '@civ-clone/core-world/LandMassRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import { HooverDam } from '../../Wonders';
import PollutionDivisor from '@civ-clone/civ1-city-improvement/Rules/PollutionDivisor';
import { onWonderLandMass } from '../lib/onWonderLandMass';

// Hoover Dam acts as a Hydro Plant in its owner's cities on its continent, so it halves the shields that count towards
//  their pollution too (v474.05 `CityWorker.cs` ~L741-753, civ-clone/web-renderer#32).
export const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => PollutionDivisor[] = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  landMassRegistry: LandMassRegistry = landMassRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): PollutionDivisor[] => [
  new PollutionDivisor(
    'civ1-wonder:city/pollution-divisor/HooverDam',
    onWonderLandMass(
      HooverDam,
      wonderRegistry,
      playerResearchRegistry,
      landMassRegistry,
      requirementRegistry
    ),
    new Effect((): number => 2)
  ),
];

export default getRules;
