import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
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
import Description from '@civ-clone/core-rule/Description';
import Effect from '@civ-clone/core-rule/Effect';
import Priority from '@civ-clone/core-rule/Priority';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';

/** The trade the Colossus adds to each square its city works that already gives trade. */
export const colossusTrade: number = 1;

/** The happy citizen each of these adds to every city of its owner. */
export const happinessWonders: [typeof Wonder, number][] = [
  [HangingGardens, 1],
  [CureForCancer, 1],
];

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry
) => CityYield[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): CityYield[] => [
  new CityYield(
    new Priority(500),
    cityHasWonder(
      Colossus,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    new Effect((city: City): Yield => {
      return new Trade(
        city
          .tilesWorked()
          .filter((tile) =>
            tile.yields().some((tileYield: Yield) => tileYield instanceof Trade)
          ).length * colossusTrade,
        Colossus.name
      );
    }),
    // What it does, for the Civilopedia (civ-clone/web-renderer#1196).
    new Description({
      type: 'tile_yield',
      subject: Colossus,
      yield: Trade,
      value: colossusTrade,
      on: 'producing',
    })
  ),

  ...happinessWonders.map(
    ([WonderType, happiness]) =>
      new CityYield(
        playerHasWonder(
          WonderType,
          wonderRegistry,
          playerResearchRegistry,
          requirementRegistry
        ),
        new Effect((): Yield => new Happiness(happiness, WonderType.name)),
        new Description({
          type: 'happy',
          subject: WonderType,
          value: happiness,
          scope: 'player',
        })
      )
  ),
];

export default getRules;
