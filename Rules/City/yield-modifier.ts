import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  CopernicusObservatory,
  HooverDam,
  IsaacNewtonsCollege,
  SetiProgram,
} from '../../Wonders';
import {
  Factory,
  HydroPlant,
  Library,
  ManufacturingPlant,
  NuclearPlant,
  PowerPlant,
  University,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
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
import { cityHasWonder, playerHasWonder } from '../lib/hasWonder';
import { Production, Research } from '@civ-clone/civ1-city/Yields';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
import { hasCityImprovement } from '../lib/hasCityImprovement';
import { onWonderLandMass } from '../lib/onWonderLandMass';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

const plants: (typeof CityImprovement)[] = [
  PowerPlant,
  HydroPlant,
  NuclearPlant,
];

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  landMassRegistry?: LandMassRegistry
) => YieldModifier[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  landMassRegistry: LandMassRegistry = landMassRegistryInstance
) => [
  ...(
    [[CopernicusObservatory, Research, 1]] as [
      typeof Wonder,
      typeof Yield,
      number
    ][]
  ).map(
    ([WonderType, YieldType, multiplier]): YieldModifier =>
      new YieldModifier(
        new Low(),
        cityHasWonder(WonderType, wonderRegistry, playerResearchRegistry),
        new Effect(
          (city: City, yields: Yield[]): Yield =>
            new YieldType(
              reduceYield(yields, YieldType) * multiplier,
              WonderType.name
            )
        )
      )
  ),

  ...(
    [[SetiProgram, Research, 0.5]] as [typeof Wonder, typeof Yield, number][]
  ).map(
    ([WonderType, YieldType, multiplier]): YieldModifier =>
      new YieldModifier(
        new Low(),
        playerHasWonder(WonderType, wonderRegistry, playerResearchRegistry),
        new Effect(
          (city: City, yields: Yield[]): Yield =>
            new YieldType(
              reduceYield(yields, YieldType) * multiplier,
              WonderType.name
            )
        )
      )
  ),

  // Isaac Newton's College raises each Library's and University's +50% to
  // +83%. Bonuses here compound rather than adding to the base, and this
  // package's rules can register before civ1-city-improvement's, so it's a
  // multiplier that gives the same result in any order: 1.5 × 11/9 = 1.83.
  // v474.05 adds base/3 per improvement instead (#390).
  ...([Library, University] as (typeof CityImprovement)[]).map(
    (Improvement): YieldModifier =>
      new YieldModifier(
        new Low(),
        playerHasWonder(
          IsaacNewtonsCollege,
          wonderRegistry,
          playerResearchRegistry
        ),
        hasCityImprovement(Improvement, cityImprovementRegistry),
        new Effect(
          (city: City, yields: Yield[]): Yield =>
            new Research(
              Math.floor((reduceYield(yields, Research) * 2) / 9),
              IsaacNewtonsCollege.name
            )
        )
      )
  ),

  // Hoover Dam acts as a plant in every city on its continent. As in v474.05,
  // it needs a Factory (or Mfg. Plant) and doesn't add to a plant already
  // there.
  new YieldModifier(
    new Low(),
    onWonderLandMass(
      HooverDam,
      wonderRegistry,
      playerResearchRegistry,
      landMassRegistry
    ),
    new Criterion((city: City): boolean => {
      const improvements = cityImprovementRegistry.getByCity(city);

      return (
        improvements.some(
          (improvement: CityImprovement): boolean =>
            improvement instanceof Factory ||
            improvement instanceof ManufacturingPlant
        ) &&
        !improvements.some((improvement: CityImprovement): boolean =>
          plants.some((Plant) => improvement instanceof Plant)
        )
      );
    }),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Production(
          Math.floor(reduceYield(yields, Production) * 0.5),
          HooverDam.name
        )
    )
  ),
];

export default getRules;
