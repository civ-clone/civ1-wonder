import { Colossus, CureForCancer, HangingGardens } from '../../Wonders';
import { Happiness, Trade } from '@civ-clone/civ1-city/Yields';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import { cityHasWonder, playerHasWonder } from '../lib/hasWonder';
import City from '@civ-clone/core-city/City';
import CityYield from '@civ-clone/core-city/Rules/Yield';
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
    cityHasWonder(Colossus, wonderRegistry, playerResearchRegistry),
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
      [HangingGardens, 1],
      [CureForCancer, 1],
    ] as [typeof Wonder, number][]
  ).map(
    ([WonderType, happiness]) =>
      new CityYield(
        playerHasWonder(WonderType, wonderRegistry, playerResearchRegistry),
        new Effect((): Yield => new Happiness(happiness, WonderType.name))
      )
  ),
];

export default getRules;
