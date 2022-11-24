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
  engine?: Engine
) => BuildingComplete[] = (
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  engine: Engine = engineInstance
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
        createOnStarted = (action: () => void) => {
          const onStarted = new Started(
            new Criterion(
              (startedPlayerResearch: PlayerResearch) =>
                startedPlayerResearch === playerResearch
            ),
            new Effect(() => {
              ruleRegistry.unregister(onStarted);

              action();
            })
          );

          ruleRegistry.register(onStarted);
        },
        completeResearch = () => {
          playerResearch.add(playerResearch.cost());

          createOnStarted(() => playerResearch.add(playerResearch.cost()));
        };

      if (playerResearch.researching() === null) {
        createOnStarted(() => completeResearch());

        return;
      }

      completeResearch();
    })
  ),
];

export default getRules;
