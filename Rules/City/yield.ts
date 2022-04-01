import { Colossus, CureForCancer, HangingGardens } from '../../Wonders';
import { Electricity, Invention } from '@civ-clone/civ1-science/Advances';
import { Happiness, Trade } from '@civ-clone/civ1-city/Yields';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Priority from '@civ-clone/core-rule/Priority';
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
    new Priority(500),
    new Criterion((city: City): boolean =>
      wonderRegistry
        .getByCity(city)
        .some((wonder: Wonder): boolean => wonder instanceof Colossus)
    ),
    new Criterion(
      (city: City): boolean =>
        !playerResearchRegistry
          .getByPlayer(city.player())
          .completed(Electricity)
    ),
    new Effect((city: City): Yield => {
      return new Trade(
        city
          .tilesWorked()
          .filter((tile) =>
            tile.yields().some((tileYield: Yield) => tileYield instanceof Trade)
          ).length,
        Colossus.name
      );
    })
  ),

  ...(
    [
      [HangingGardens, 1, Invention],
      [CureForCancer, 1, null],
    ] as [typeof Wonder, number, typeof Advance | null][]
  ).map(
    ([WonderType, happiness, ObsoletingAdvance]) =>
      new CityYield(
        new Criterion((city: City): boolean =>
          wonderRegistry.some(
            (wonder: Wonder): boolean =>
              wonder instanceof WonderType &&
              wonder.city().player() === city.player()
          )
        ),
        new Criterion(
          (city: City): boolean =>
            ObsoletingAdvance === null ||
            !playerResearchRegistry
              .getByPlayer(city.player())
              .completed(ObsoletingAdvance)
        ),
        new Effect((): Yield => new Happiness(happiness, WonderType.name))
      )
  ),
];

export default getRules;
