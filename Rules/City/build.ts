import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  Deriver,
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import { HooverDam } from '../../Wonders';
import {
  HydroPlant,
  NuclearPlant,
  PowerPlant,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  LandMassRegistry,
  instance as landMassRegistryInstance,
} from '@civ-clone/core-world/LandMassRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  Requirement,
  Target,
  met,
} from '@civ-clone/core-requirement/Requirement';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import buildRequirements from '../../Requirements';
import { onWonderLandMass } from '../lib/onWonderLandMass';

/** A Wonder is built once in the world: a state of the game, so a rule written by hand. */
export const builtOnceRule = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Build =>
  new Build(
    'civ1-wonder:city/build/once',
    Wonder,
    new Criterion((city: City, BuildItem: IConstructor): boolean =>
      Object.isPrototypeOf.call(Wonder, BuildItem)
    ),
    new Effect(
      (city: City, WonderType: IConstructor): IBuildCriterion =>
        new Criterion(
          (): boolean =>
            wonderRegistry.filter(
              (wonder: Wonder): boolean => wonder instanceof WonderType
            ).length === 0
        )
    )
  );

/**
 * The rule `entry` is played by: a city may build its subject only once each advance and Wonder it `requires` is held,
 * by the city's player or, for a `world` entry, by anyone (the Manhattan Project, for Nuclear units).
 */
export const buildRulesFor = (
  entry: Requirement,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Build[] => {
  if (entry.relation !== 'requires') {
    return [];
  }

  // Whose Wonder or advance counts is the entry's `range`: Civ1's Manhattan Project is anyone's (`world`), an
  //  advance the city's player's (`player`).
  const has = (city: City, target: Target): boolean => {
    if (Object.prototype.isPrototypeOf.call(Wonder, target)) {
      const isTarget = (wonder: Wonder): boolean =>
        wonder instanceof (target as typeof Wonder);

      return entry.range === 'world'
        ? wonderRegistry.some(isTarget)
        : entry.range === 'city'
        ? wonderRegistry.getByCity(city).some(isTarget)
        : wonderRegistry.getByPlayer(city.player()).some(isTarget);
    }

    return entry.range === 'world'
      ? playerResearchRegistry.some((playerResearch: PlayerResearch): boolean =>
          playerResearch.completed(target as typeof Advance)
        )
      : playerResearchRegistry
          .getByPlayer(city.player())
          .completed(target as typeof Advance);
  };

  return [
    new Build(
      entry.id,
      entry.subject,
      new Criterion(
        (city: City, BuildItem: IConstructor): boolean =>
          BuildItem === entry.subject
      ),
      new Effect(
        (city: City): IBuildCriterion =>
          new Criterion((): boolean =>
            met(entry, (target: Target): boolean => has(city, target))
          )
      )
    ),
  ];
};

/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
export const deriveBuildRules =
  (
    playerResearchRegistry: PlayerResearchRegistry,
    wonderRegistry: WonderRegistry
  ): Deriver =>
  (entry: Requirement): Build[] =>
    buildRulesFor(entry, playerResearchRegistry, wonderRegistry);

/**
 * As v474.05's production menu, a city that Hoover Dam already acts as a plant for isn't offered one (OpenCivOne's
 * decompile, `Segment_1ade.cs` `F0_1ade_0421`).
 */
export const hooverDamPlantRules = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  landMassRegistry: LandMassRegistry = landMassRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): Build[] =>
  ([PowerPlant, HydroPlant, NuclearPlant] as (typeof CityImprovement)[]).map(
    (Plant): Build => {
      const hooverDam = onWonderLandMass(
        HooverDam,
        wonderRegistry,
        playerResearchRegistry,
        landMassRegistry,
        requirementRegistry
      );

      return new Build(
        `civ1-wonder:city/build/hoover-dam-plant/${Plant.name}`,
        Plant,
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean => BuildItem === Plant
        ),
        new Effect(
          (city: City): IBuildCriterion =>
            new Criterion((): boolean => !hooverDam.validate(city))
        )
      );
    }
  );

/**
 * Every rule about building Wonders, and what they make buildable or not, as `registerRules` registers them: built
 * once, one for each of `Requirements`' build entries, then Hoover Dam's plants. For a rule registry without a game's
 * `requirements` (tests): a game's are registered through `game.requirements`, so a plugin can change an entry and its
 * rule together.
 */
export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  landMassRegistry?: LandMassRegistry,
  requirementRegistry?: RequirementRegistry
) => Build[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  landMassRegistry: LandMassRegistry = landMassRegistryInstance,
  requirementRegistry: RequirementRegistry = requirementRegistryInstance
): Build[] => [
  builtOnceRule(wonderRegistry),
  ...buildRequirements.flatMap((entry: Requirement): Build[] =>
    buildRulesFor(entry, playerResearchRegistry, wonderRegistry)
  ),
  ...hooverDamPlantRules(
    playerResearchRegistry,
    wonderRegistry,
    landMassRegistry,
    requirementRegistry
  ),
];

export default getRules;
