import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import {
  Cathedral,
  Temple,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Mysticism } from '@civ-clone/civ1-science/Advances';
import {
  JsBachsCathedral,
  MichelangelosChapel,
  Oracle,
  ShakespearesTheatre,
  WomensSuffrage,
} from '../../Wonders';
import {
  LandMassRegistry,
  instance as landMassRegistryInstance,
} from '@civ-clone/core-world/LandMassRegistry';
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
  notDiscoveredByPlayer,
} from '../lib/hasDiscovered';
import City from '@civ-clone/core-city/City';
import Cost from '@civ-clone/core-city/Rules/Cost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Description from '@civ-clone/core-rule/Description';
import Effect from '@civ-clone/core-rule/Effect';
import { Low } from '@civ-clone/core-rule/Priorities';
import { MilitaryUnhappiness } from '@civ-clone/civ1-city-happiness/Yields';
import Priority from '@civ-clone/core-rule/Priority';
import { Unhappiness } from '@civ-clone/civ1-city/Yields';
import Yield from '@civ-clone/core-yield/Yield';
import { hasCityImprovement } from '../lib/hasCityImprovement';
import { onWonderLandMass } from '../lib/onWonderLandMass';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

// The unhappy citizens each Wonder makes content, read by its rule and by what the rule says it does
//  (civ-clone/web-renderer#1196): the Oracle's in a city with a Temple (more once its owner knows Mysticism), J.S.
//  Bach's in every city of its owner on its continent, Michelangelo's in a city with a Cathedral, and Women's
//  Suffrage's for each unit that makes a citizen unhappy.
export const oracleContent: number = 1,
  oracleMysticismContent: number = 2,
  bachContent: number = 2,
  michelangeloContent: number = 2,
  suffrageContent: number = 1;

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  unitRegistry?: UnitRegistry,
  wonderRegistry?: WonderRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => Cost[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  landMassRegistry: LandMassRegistry = landMassRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): Cost[] => [
  new Cost(
    new Low(),
    playerHasWonder(
      Oracle,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    hasCityImprovement(Temple, cityImprovementRegistry),
    notDiscoveredByPlayer(Mysticism, playerResearchRegistry),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(oracleContent, reduceYield(yields, Unhappiness)),
          Oracle.name
        )
    ),
    new Description({
      type: 'content',
      subject: Oracle,
      value: oracleContent,
      step: 'more',
      inCitiesWith: [Temple],
      until: Mysticism,
      scope: 'player',
    })
  ),

  new Cost(
    new Low(),
    playerHasWonder(
      Oracle,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    hasCityImprovement(Temple, cityImprovementRegistry),
    discoveredByPlayer(Mysticism, playerResearchRegistry),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(oracleMysticismContent, reduceYield(yields, Unhappiness)),
          Oracle.name
        )
    ),
    new Description({
      type: 'content',
      subject: Oracle,
      value: oracleMysticismContent,
      step: 'more',
      inCitiesWith: [Temple],
      with: [Mysticism],
      scope: 'player',
    })
  ),

  new Cost(
    new Priority(4000), // X Low
    cityHasWonder(
      ShakespearesTheatre,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -reduceYield(yields, Unhappiness),
          ShakespearesTheatre.name
        )
    ),
    new Description({
      type: 'content',
      subject: ShakespearesTheatre,
      amount: 'all',
    })
  ),

  new Cost(
    new Low(),
    onWonderLandMass(
      JsBachsCathedral,
      wonderRegistry,
      playerResearchRegistry,
      landMassRegistry,
      requirementRegistry
    ),
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(bachContent, reduceYield(yields, Unhappiness)),
          JsBachsCathedral.name
        )
    ),
    new Description({
      type: 'content',
      subject: JsBachsCathedral,
      value: bachContent,
      scope: 'continent',
    })
  ),

  new Cost(
    new Low(),
    playerHasWonder(
      MichelangelosChapel,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    hasCityImprovement(Cathedral, cityImprovementRegistry),
    // A Cathedral makes 6 content instead of 4: civ1-city-happiness gives the 4.
    new Effect(
      (city: City, yields: Yield[]): Yield =>
        new Unhappiness(
          -Math.min(michelangeloContent, reduceYield(yields, Unhappiness)),
          MichelangelosChapel.name
        )
    ),
    new Description({
      type: 'content',
      subject: MichelangelosChapel,
      value: michelangeloContent,
      step: 'more',
      inCitiesWith: [Cathedral],
      scope: 'player',
    })
  ),

  new Cost(
    new Low(),
    playerHasWonder(
      WomensSuffrage,
      wonderRegistry,
      playerResearchRegistry,
      requirementRegistry
    ),
    new Criterion((city: City, cityYields: Yield[]): boolean =>
      cityYields.some((cityYield) => cityYield instanceof MilitaryUnhappiness)
    ),
    new Effect((city: City, cityYields: Yield[]): Yield[] =>
      cityYields.flatMap((cityYield) => {
        if (!(cityYield instanceof MilitaryUnhappiness)) {
          return [];
        }

        // TODO: custom `Yield` for this?
        return new Unhappiness(-suffrageContent, WomensSuffrage.name);
      })
    ),
    new Description({
      type: 'military_unhappiness',
      subject: WomensSuffrage,
      value: suffrageContent,
      scope: 'player',
    })
  ),
];

export default getRules;
