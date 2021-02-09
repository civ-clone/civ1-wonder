import {
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  Lighthouse,
  MagellansExpedition,
  Oracle,
  Pyramids,
} from '../../Wonders';
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: () => BuildCost[] = (): BuildCost[] => [
  ...([
    [Colossus, 200],
    [CopernicusObservatory, 300],
    [GreatLibrary, 300],
    [GreatWall, 300],
    [HangingGardens, 300],
    [Lighthouse, 200],
    [MagellansExpedition, 400],
    [Oracle, 300],
    [Pyramids, 300],
  ] as [typeof Wonder, number][]).map(
    ([WonderType, cost]: [typeof Wonder, number]): BuildCost =>
      new BuildCost(
        new Criterion(
          (BuildItem: IConstructor): boolean => BuildItem === WonderType
        ),
        new Effect((): number => cost)
      )
  ),
];

export default getRules;
