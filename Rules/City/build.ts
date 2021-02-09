import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (wonderRegistry?: WonderRegistry) => Build[] = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Build[] => [
  new Build(
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
  ),
];

export default getRules;
