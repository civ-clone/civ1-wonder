import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const cityHasWonder = (
  WonderType: typeof Wonder,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
) =>
  new Criterion((city: City): boolean =>
    wonderRegistry
      .getByCity(city)
      .some((wonder: Wonder): boolean => wonder instanceof WonderType)
  );

export const playerHasWonder = (
  WonderType: typeof Wonder,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
) =>
  new Criterion((item: City | Unit): boolean =>
    wonderRegistry
      .getByPlayer(item.player())
      .some((wonder: Wonder): boolean => wonder instanceof WonderType)
  );
