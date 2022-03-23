import {
  Automobile,
  Electricity,
  Invention,
} from '@civ-clone/civ1-science/Advances';
import {
  Colossus,
  CopernicusObservatory,
  CureForCancer,
  HangingGardens,
  SetiProgram,
} from '../../Wonders';
import { Happiness, Research, Trade } from '@civ-clone/civ1-city/Yields';
import { High, Low } from '@civ-clone/core-rule/Priorities';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => CityYield[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
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
];

export default getRules;
