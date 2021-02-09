import {
  // Automobile,
  // Electricity,
  Invention,
  Mysticism,
  // Religion,
} from '@civ-clone/civ1-science/Advances';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Colossus,
  CopernicusObservatory,
  HangingGardens,
  Oracle,
} from '../../Wonders';
import { Temple } from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  Happiness,
  Research,
  Trade,
  Unhappiness,
} from '@civ-clone/civ1-city/Yields';
import { High, Low } from '@civ-clone/core-rule/Priorities';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Tile from '@civ-clone/core-world/Tile';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry
) => CityYield[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
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
    // new Criterion((cityYield: Yield, city: City): boolean => ! playerResearchRegistry.getByPlayer('city.player())
    //   .completed(Electricity)
    // ),
    new Effect((cityYield: Yield): void =>
      cityYield.add(cityYield.value(), 'colossus')
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
    // new Criterion((cityYield: Yield, city: City): boolean => ! playerResearchRegistry.getByPlayer(city.player())
    //   .completed(Automobile)
    // ),
    new Effect((cityYield: Yield): void =>
      cityYield.add(cityYield, 'copernicus-observatory')
    )
  ),
  new CityYield(
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Happiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry
        .filter((wonder: Wonder): boolean => wonder instanceof HangingGardens)
        .some(
          (wonder: Wonder): boolean => wonder.city().player() === city.player()
        )
    ),
    new Criterion(
      (cityYield: Yield, city: City): boolean =>
        !playerResearchRegistry.getByPlayer(city.player()).completed(Invention)
    ),
    new Effect((cityYield: Yield): void => cityYield.add(1, 'hanging-gardens'))
  ),
  new CityYield(
    new Low(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry
        .filter((wonder: Wonder): boolean => wonder instanceof Oracle)
        .some((wonder): boolean => wonder.city().player() === city.player())
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
    // new Criterion((cityYield: Yield, city: City): boolean => ! playerResearchRegistry.getByPlayer(city.player())
    //   .completed(Religion)
    // ),
    new Effect((cityYield: Yield): void => cityYield.subtract(1, 'oracle'))
  ),
  new CityYield(
    new Low(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Unhappiness
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      wonderRegistry
        .filter((wonder) => wonder instanceof Oracle)
        .some(
          (wonder: Wonder): boolean => wonder.city().player() === city.player()
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
    // new Criterion((cityYield, city) => ! playerResearchRegistry.getByPlayer(city.player())
    //   .completed(Religion)
    // ),
    new Effect((cityYield: Yield): void =>
      cityYield.subtract(2, 'oracle-mysticism')
    )
  ),
];

export default getRules;
