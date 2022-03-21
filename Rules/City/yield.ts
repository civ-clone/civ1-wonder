import {
  Automobile,
  Communism,
  Electricity,
  Electronics,
  Invention,
  Mysticism,
  Religion,
} from '@civ-clone/civ1-science/Advances';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Colossus,
  CopernicusObservatory,
  CureForCancer,
  HangingGardens,
  JsBachsCathedral,
  MichelangelosChapel,
  Oracle,
  SetiProgram,
  ShakespearesTheatre,
  WomensSuffrage,
} from '../../Wonders';
import {
  Cathedral,
  Temple,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  Happiness,
  Research,
  Trade,
  Unhappiness,
} from '@civ-clone/civ1-city/Yields';
import { High, Low } from '@civ-clone/core-rule/Priorities';
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
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  unitRegistry?: UnitRegistry
) => CityYield[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): CityYield[] => [
  new CityYield(
    new High(),
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Trade),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry
        .getByCity(city)
        .some((wonder: Wonder): boolean => wonder instanceof Colossus)
    ),
    new Criterion(
      (cityYield: Yield, city: City): boolean =>
        !playerResearchRegistry
          .getByPlayer(city.player())
          .completed(Electricity)
    ),
    new Effect((cityYield: Yield): void =>
      cityYield.add(cityYield.value(), Colossus.name)
    )
  ),
  new CityYield(
    new Low(),
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Research),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry
        .getByCity(city)
        .some(
          (wonder: Wonder): boolean => wonder instanceof CopernicusObservatory
        )
    ),
    new Criterion(
      (cityYield: Yield, city: City): boolean =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Automobile)
    ),
    new Effect((cityYield: Yield): void =>
      cityYield.add(cityYield, CopernicusObservatory.name)
    )
  ),
  new CityYield(
    new Low(),
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Research),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder) =>
          wonder instanceof SetiProgram &&
          wonder.city().player() === city.player()
      )
    ),
    new Effect((cityYield: Yield): void =>
      cityYield.add(cityYield.value() * 0.5, SetiProgram.name)
    )
  ),
  new CityYield(
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Happiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof HangingGardens &&
          wonder.city().player() === city.player()
      )
    ),
    new Criterion(
      (cityYield: Yield, city: City): boolean =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Invention)
    ),
    new Effect((cityYield: Yield): void =>
      cityYield.add(1, HangingGardens.name)
    )
  ),
  new CityYield(
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Happiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof CureForCancer &&
          wonder.city().player() === city.player()
      )
    ),
    new Effect((cityYield: Yield): void => cityYield.add(1, CureForCancer.name))
  ),
  new CityYield(
    new Low(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder): boolean =>
          wonder instanceof Oracle && wonder.city().player() === city.player()
      )
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Temple
        )
    ),
    new Criterion(
      (cityYield: Yield, city: City): boolean =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Mysticism)
    ),
    new Criterion(
      (cityYield: Yield, city: City): boolean =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Religion)
    ),
    new Effect((cityYield: Yield): void => cityYield.subtract(1, Oracle.name))
  ),
  new CityYield(
    new Low(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof Oracle && wonder.city().player() === city.player()
      )
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Temple
        )
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      playerResearchRegistry.getByPlayer(city.player()).completed(Mysticism)
    ),
    new Criterion(
      (cityYield, city) =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Religion)
    ),
    new Effect((cityYield: Yield): void => cityYield.subtract(2, Oracle.name))
  ),
  new CityYield(
    new Low(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof ShakespearesTheatre &&
          wonder.city().player() === city.player()
      )
    ),
    new Criterion(
      (cityYield, city) =>
        !playerResearchRegistry
          .getByPlayer(city.player())
          .completed(Electronics)
    ),
    new Effect((cityYield: Yield): void =>
      cityYield.subtract(cityYield.value(), ShakespearesTheatre.name)
    )
  ),

  new CityYield(
    new Low(),
    // TODO: path check to city that has it to check it's on the same continent...
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof JsBachsCathedral &&
          wonder.city().player() === city.player()
      )
    ),
    new Effect((cityYield: Yield): void =>
      cityYield.subtract(Math.min(cityYield.value(), 2), JsBachsCathedral.name)
    )
  ),

  new CityYield(
    new Low(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (cityImprovement: CityImprovement) =>
            cityImprovement instanceof Cathedral
        )
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof MichelangelosChapel &&
          wonder.city().player() === city.player()
      )
    ),
    new Criterion(
      (cityYield, city) =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Communism)
    ),
    new Effect((cityYield: Yield): void =>
      cityYield.subtract(
        Math.min(cityYield.value(), 2),
        MichelangelosChapel.name
      )
    )
  ),

  new CityYield(
    new Low(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean =>
          wonder instanceof WomensSuffrage &&
          wonder.city().player() === city.player()
      )
    ),
    new Effect((cityYield: Yield, city: City): void =>
      cityYield.subtract(
        Math.min(
          cityYield.value(),
          unitRegistry
            .getByCity(city)
            .filter((unit: Unit) => unit.tile() !== city.tile()).length
        ),
        WomensSuffrage.name
      )
    )
  ),
];

export default getRules;
