import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
export declare const cityHasWonder: (
  WonderType: typeof Wonder,
  wonderRegistry?: WonderRegistry
) => Criterion<[city: City]>;
export declare const playerHasWonder: (
  WonderType: typeof Wonder,
  wonderRegistry?: WonderRegistry
) => Criterion<[item: City | Unit]>;
