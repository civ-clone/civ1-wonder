import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import {
  PendingEffect,
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import { DARWINS_VOYAGE, spendFreeResearch } from '../PlayerResearch/started';
import Buildable, {
  BuildableInstance,
} from '@civ-clone/core-city-build/Buildable';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import { DarwinsVoyage } from '../../Wonders';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Started from '@civ-clone/core-science/Rules/Started';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry,
  engine?: Engine,
  pendingEffects?: PendingEffectRegistry
) => BuildingComplete[] = (
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  engine: Engine = engineInstance,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): BuildingComplete[] => [
  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, built: BuildableInstance): boolean =>
        built instanceof Wonder
    ),
    new Effect((cityBuild: CityBuild, built: BuildableInstance): void => {
      const WonderType = built.constructor as typeof Wonder;

      wonderRegistry.register(built as Wonder);
      cityBuildRegistry
        .filter(
          (cityBuild: CityBuild): boolean =>
            cityBuild.building()?.item() ===
            (WonderType as unknown as typeof Buildable)
        )
        .forEach((cityBuild: CityBuild): void => cityBuild.revalidate());
    })
  ),
  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, built: BuildableInstance): boolean =>
        built instanceof Wonder
    ),
    new Effect((cityBuild: CityBuild, built: BuildableInstance): void => {
      engine.emit('wonder:built', built, cityBuild.city());
    })
  ),

  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, built: BuildableInstance): boolean =>
        built instanceof DarwinsVoyage
    ),
    new Effect((cityBuild: CityBuild): void => {
      const playerResearch = playerResearchRegistry.getByPlayer(
          cityBuild.city().player()
        ),
        // Two free research completions, recorded as a debt against the
        // player's research rather than as a pair of self-registering one-shot
        // rules. The old version kept the only record of them in a closure, so
        // a save taken between finishing the wonder and starting the next
        // research lost them with no symptom — which is the bug
        // `01-constraints.md` §4 describes.
        pendingEffect = new PendingEffect(DARWINS_VOYAGE, playerResearch, {
          remaining: '2',
        });

      pendingEffects.handler(
        DARWINS_VOYAGE,
        (discharged: PendingEffect): void =>
          (discharged.target() as PlayerResearch).add(
            (discharged.target() as PlayerResearch).cost()
          )
      );

      pendingEffects.register(pendingEffect);

      // Already researching something, so one is spent now rather than
      // waiting for the next thing they start. `Rules/PlayerResearch/started`
      // spends the rest, one per research start.
      if (playerResearch.researching() !== null) {
        spendFreeResearch(playerResearch, pendingEffect, pendingEffects);
      }
    })
  ),
];

export default getRules;
