import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
import Criterion from '@civ-clone/core-rule/Criterion';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (wonderRegistry?: WonderRegistry) => Destroyed[] = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Destroyed[] => [
  new Destroyed(
    new Criterion((city: City) => wonderRegistry.getByCity(city).length > 0),
    new Effect((city: City) =>
      wonderRegistry
        .getByCity(city)
        .forEach((wonder: Wonder) => wonderRegistry.unregister(wonder))
    )
  ),
];

export default getRules;
