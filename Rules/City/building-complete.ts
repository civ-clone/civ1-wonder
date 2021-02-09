import {
  BuildingComplete,
  ICompletedBuildItem,
} from '@civ-clone/core-city-build/Rules/BulidingComplete';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  wonderRegistry?: WonderRegistry
) => BuildingComplete[] = (
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): BuildingComplete[] => [
  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, built: ICompletedBuildItem): boolean =>
        built instanceof Wonder
    ),
    new Effect((cityBuild: CityBuild, built: ICompletedBuildItem): void => {
      const WonderType = built.constructor as typeof Wonder;

      wonderRegistry.register(built as Wonder);
      cityBuildRegistry
        .filter(
          (cityBuild: CityBuild): boolean => cityBuild.building() === WonderType
        )
        .forEach((cityBuild: CityBuild): void => cityBuild.revalidate());
    })
  ),
];

export default getRules;
