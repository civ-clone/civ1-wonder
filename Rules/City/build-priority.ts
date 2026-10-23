import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  Lighthouse,
  MagellansExpedition,
  ManhattanProject,
} from '../../Wonders';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import BuildPriority from '@civ-clone/core-city-build/Rules/BuildPriority';
import { IBuildable as Buildable } from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Naval } from '@civ-clone/civ1-unit/Types';
import { Production } from '@civ-clone/civ1-city/Yields';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import { isObsolete } from '../lib/obsolete';

// How much a city on Auto, or a computer player, wants a Wonder (civ-clone/web-renderer#194): a little, next to what the
//  city lacks, and only where it makes `wonderShields` or more, the Wonder would do something for its player, and none
//  of the player's other cities is building it already.
export const wonderPriority = 1.5;

export const wonderShields = 5;

// Wonders that only help ships, so do nothing for a player with none.
const forShips: (typeof Wonder)[] = [Lighthouse, MagellansExpedition];

// Wonders that do a player more harm than good: the Manhattan Project lets every player build nuclear weapons.
const neverWanted: (typeof Wonder)[] = [ManhattanProject];

const isWonder = (BuildItem: Buildable): boolean =>
  Object.prototype.isPrototypeOf.call(Wonder, BuildItem);

export const getRules: (
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  unitRegistry?: UnitRegistry,
  requirementRegistry?: RequirementRegistry
) => BuildPriority[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): BuildPriority[] => [
  new BuildPriority(
    'civ1-wonder:city/build-priority/wonder',
    new Criterion((cityBuild: CityBuild, BuildItem: Buildable): boolean =>
      isWonder(BuildItem)
    ),
    new Criterion(
      (cityBuild: CityBuild, BuildItem: Buildable): boolean =>
        !neverWanted.includes(BuildItem as unknown as typeof Wonder) &&
        !isObsolete(
          BuildItem as unknown as typeof Wonder,
          playerResearchRegistry,
          requirementRegistry
        )
    ),
    new Criterion(
      (cityBuild: CityBuild, BuildItem: Buildable): boolean =>
        !forShips.includes(BuildItem as unknown as typeof Wonder) ||
        unitRegistry
          .getByPlayer(cityBuild.city().player())
          .some((unit: Unit): boolean => unit instanceof Naval)
    ),
    new Criterion(
      (cityBuild: CityBuild, BuildItem: Buildable): boolean =>
        !cityRegistry
          .getByPlayer(cityBuild.city().player())
          .some(
            (city: City): boolean =>
              city !== cityBuild.city() &&
              cityBuildRegistry.getByCity(city).building()?.item() === BuildItem
          )
    ),
    new Criterion(
      (cityBuild: CityBuild, BuildItem: Buildable, yields: Yield[]): boolean =>
        yields
          .filter(
            (cityYield: Yield): boolean => cityYield instanceof Production
          )
          .reduce(
            (total: number, cityYield: Yield): number =>
              total + cityYield.value(),
            0
          ) >= wonderShields
    ),
    new Effect((): number => wonderPriority)
  ),
];

export default getRules;
