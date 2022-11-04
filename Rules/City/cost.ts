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
import { cityHasWonder, playerHasWonder } from '../lib/hasWonder';
import {
  discoveredByPlayer,
  notDiscoveredByAnyPlayer,
  notDiscoveredByPlayer,
} from '../lib/hasDiscovered';
import City from '@civ-clone/core-city/City';
import Cost from '@civ-clone/core-city/Rules/Cost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import { MilitaryUnhappiness } from '@civ-clone/civ1-city-happiness/Yields';
import Priority from '@civ-clone/core-rule/Priority';
import { Unhappiness } from '@civ-clone/civ1-city/Yields';
import Yield from '@civ-clone/core-yield/Yield';
import { hasCityImprovement } from '../lib/hasCityImprovement';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

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
    playerHasWonder(Oracle, wonderRegistry),
    hasCityImprovement(Temple, cityImprovementRegistry),
    notDiscoveredByPlayer(Mysticism, playerResearchRegistry),
    notDiscoveredByAnyPlayer(Religion, playerResearchRegistry),
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
    playerHasWonder(Oracle, wonderRegistry),
    hasCityImprovement(Temple, cityImprovementRegistry),
    discoveredByPlayer(Mysticism, playerResearchRegistry),
    notDiscoveredByAnyPlayer(Religion, playerResearchRegistry),
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
    cityHasWonder(ShakespearesTheatre, wonderRegistry),
    notDiscoveredByAnyPlayer(Electronics, playerResearchRegistry),
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
    playerHasWonder(JsBachsCathedral, wonderRegistry),
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
    playerHasWonder(MichelangelosChapel, wonderRegistry),
    hasCityImprovement(Cathedral, cityImprovementRegistry),
    notDiscoveredByAnyPlayer(Communism, playerResearchRegistry),
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
    playerHasWonder(WomensSuffrage, wonderRegistry),
    new Criterion((city: City, cityYields: Yield[]): boolean =>
      cityYields.some((cityYield) => cityYield instanceof MilitaryUnhappiness)
    ),
    new Effect((city: City, cityYields: Yield[]): Yield[] =>
      cityYields.flatMap((cityYield) => {
        if (!(cityYield instanceof MilitaryUnhappiness)) {
          return [];
        }

        // TODO: custom `Yield` for this?
        return new Unhappiness(-1, WomensSuffrage.name);
      })
    )
  ),
];

export default getRules;
