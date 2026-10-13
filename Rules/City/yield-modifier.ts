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
import Priority from '@civ-clone/core-rule/Priority';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
import { onWonderLandMass } from '../lib/onWonderLandMass';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

const newtonImprovements: (typeof CityImprovement)[] = [Library, University];

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
  // +83%. Bonuses here compound rather than adding to the base, so it's a
  // multiplier, ×11/9 per improvement (1.5 × 11/9 = 1.83). One rule, one
  // floor, and after every `Low` modifier whatever order the packages register
  // in, so rounding can't depend on whether the Library ran first. v474.05
  // adds base/3 per improvement instead (#390).
  new YieldModifier(
    new Priority(4000), // X Low
    playerHasWonder(
      IsaacNewtonsCollege,
      wonderRegistry,
      playerResearchRegistry
    ),
    new Criterion((city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some((improvement: CityImprovement): boolean =>
          newtonImprovements.some(
            (Improvement) => improvement instanceof Improvement
          )
        )
    ),
    new Effect((city: City, yields: Yield[]): Yield => {
      const improvements = cityImprovementRegistry.getByCity(city),
        count = newtonImprovements.filter((Improvement) =>
          improvements.some(
            (improvement: CityImprovement): boolean =>
              improvement instanceof Improvement
          )
        ).length;

      return new Research(
        Math.floor(
          (reduceYield(yields, Research) * (11 ** count - 9 ** count)) /
            9 ** count
        ),
        IsaacNewtonsCollege.name
      );
    })
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
