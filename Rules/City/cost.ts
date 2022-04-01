import { Air, Fortifiable, Naval } from '@civ-clone/civ1-unit/Types';
import {
  Cathedral,
  Temple,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Communism,
  Electronics,
  Mysticism,
  Religion,
} from '@civ-clone/civ1-science/Advances';
import { Democracy, Republic } from '@civ-clone/civ1-government/Governments';
import {
  JsBachsCathedral,
  MichelangelosChapel,
  Oracle,
  ShakespearesTheatre,
  WomensSuffrage,
} from '../../Wonders';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Cost from '@civ-clone/core-city/Rules/Cost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import { Unhappiness } from '@civ-clone/civ1-city/Yields';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
import Priority from '@civ-clone/core-rule/Priority';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  unitRegistry?: UnitRegistry,
  wonderRegistry?: WonderRegistry
) => Cost[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Cost[] => [
  new Cost(
    new Low(),
    new Criterion((city: City): boolean =>
      wonderRegistry.some(
        (wonder): boolean =>
          wonder instanceof Oracle && wonder.city().player() === city.player()
      )
    ),
    new Criterion((city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Temple
        )
    ),
    new Criterion(
      (city: City): boolean =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Mysticism)
    ),
    new Criterion(
      (city: City): boolean =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Religion)
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(1, reduceYield(yields, Unhappiness)),
          Oracle.name
        )
    )
  ),

  new Cost(
    new Low(),
    new Criterion((city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof Oracle && wonder.city().player() === city.player()
      )
    ),
    new Criterion((city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Temple
        )
    ),
    new Criterion((city: City): boolean =>
      playerResearchRegistry.getByPlayer(city.player()).completed(Mysticism)
    ),
    new Criterion(
      (city: City) =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Religion)
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(2, reduceYield(yields, Unhappiness)),
          Oracle.name
        )
    )
  ),

  new Cost(
    new Priority(4000), // X Low
    new Criterion((city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof ShakespearesTheatre &&
          wonder.city().player() === city.player()
      )
    ),
    new Criterion(
      (city: City) =>
        !playerResearchRegistry
          .getByPlayer(city.player())
          .completed(Electronics)
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -reduceYield(yields, Unhappiness),
          ShakespearesTheatre.name
        )
    )
  ),

  new Cost(
    new Low(),
    // TODO: path check to city that has it to check it's on the same continent...
    new Criterion((city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof JsBachsCathedral &&
          wonder.city().player() === city.player()
      )
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(2, reduceYield(yields, Unhappiness)),
          JsBachsCathedral.name
        )
    )
  ),

  new Cost(
    new Low(),
    new Criterion((city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (cityImprovement: CityImprovement) =>
            cityImprovement instanceof Cathedral
        )
    ),
    new Criterion((city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof MichelangelosChapel &&
          wonder.city().player() === city.player()
      )
    ),
    new Criterion(
      (city: City) =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Communism)
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(4, reduceYield(yields, Unhappiness)),
          MichelangelosChapel.name
        )
    )
  ),

  new Cost(
    new Low(),
    new Criterion((city: City): boolean =>
      playerGovernmentRegistry
        .getByPlayer(city.player())
        .is(Republic, Democracy)
    ),
    new Criterion((city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof WomensSuffrage &&
          wonder.city().player() === city.player()
      )
    ),
    new Criterion(
      (city: City): boolean =>
        unitRegistry
          .getByCity(city)
          .filter(
            (unit: Unit) =>
              [Air, Fortifiable, Naval].some(
                (UnitType) => unit instanceof UnitType
              ) && unit.tile() !== city.tile()
          ).length > 0
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(
            unitRegistry
              .getByCity(city)
              .filter(
                (unit: Unit) =>
                  [Air, Fortifiable, Naval].some(
                    (UnitType) => unit instanceof UnitType
                  ) && unit.tile() !== city.tile()
              ).length,
            reduceYield(yields, Unhappiness)
          ),
          WomensSuffrage.name
        )
    )
  ),
];

export default getRules;
