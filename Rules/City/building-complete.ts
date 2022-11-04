import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  wonderRegistry?: WonderRegistry,
  engine?: Engine
) => BuildingComplete[] = (
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  engine: Engine = engineInstance
): BuildingComplete[] => [
  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, built: Buildable): boolean =>
        built instanceof Wonder
    ),
    new Effect((cityBuild: CityBuild, built: Buildable): void => {
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
      (cityBuild: CityBuild, built: Buildable): boolean =>
        built instanceof Wonder
    ),
    new Effect((cityBuild: CityBuild, built: Buildable): void => {
      engine.emit('wonder:built', built, cityBuild.city());
    })
  ),
];

export default getRules;
