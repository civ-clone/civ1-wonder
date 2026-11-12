import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import High from '@civ-clone/core-rule/Priorities/High';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import { Production } from '@civ-clone/civ1-city/Yields';
import Wonder from '@civ-clone/core-wonder/Wonder';
import Yield from '@civ-clone/core-yield/Yield';
import { everBuilt } from '../../lib/wonderHistory';

export const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  wonderRegistry?: WonderRegistry,
  cityImprovementRegistry?: CityImprovementRegistry
) => ProcessYield[] = (
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): ProcessYield[] => [
  // A Wonder that has been built is never completed again (civ-clone/web-renderer#971). v474.05 checks it as the
  //  shields would complete it, and keeps the shields (`CITYMGT.C` 672-677):
  //
  //  ```c
  //  if (scratch_i > 24) {
  //      if ((marvel_site - 24)[scratch_i] == -1) {
  //          (marvel_site - 24)[scratch_i] = city;
  //          ...
  //      } else {
  //          scratch_i = -1;
  //      }
  //  ```
  //
  //  It leaves the Wonder chosen, flashing on the city screen (`CITYMGT.C` 1294) until the player changes it. Here
  //  `once` stops it being chosen, and a rival's build is dropped when the Wonder is completed
  //  (`Rules/City/building-complete`), so only a game saved before #971, with a lost Wonder part way through being
  //  built again, reaches this: the build is dropped instead (`CityBuild#revalidate`, cleared as `unavailable`, its
  //  shields kept), so a computer player's city isn't left building it for ever.
  //
  //  The only way a build completes in play is `CityBuild#check()` in `civ1-city`'s production `ProcessYield`, after
  //  this turn's shields are added; buying it and a Caravan helping build it only add shields, which that then
  //  completes. That rule is `Normal`; this is `High`, so it runs first for each city whichever package loads first.
  new ProcessYield(
    'civ1-wonder:city/process-yield/drop-built-wonder',
    new High(),
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Production
    ),
    new Criterion((cityYield: Yield, city: City): boolean => {
      const Item = cityBuildRegistry.getByCity(city)?.building()?.item();

      return (
        Item !== undefined &&
        Object.prototype.isPrototypeOf.call(Wonder, Item) &&
        everBuilt(
          Item as unknown as typeof Wonder,
          wonderRegistry,
          cityImprovementRegistry
        )
      );
    }),
    new Effect((cityYield: Yield, city: City): void =>
      cityBuildRegistry.getByCity(city).revalidate()
    )
  ),
];

export default getRules;
