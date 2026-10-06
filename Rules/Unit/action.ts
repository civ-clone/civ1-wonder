import {
  Action,
  hasMovesLeft,
  isNeighbouringTile,
} from '@civ-clone/core-unit/Rules/Action';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import { Caravan } from '@civ-clone/civ1-unit/Units';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { HelpBuildWonder } from '@civ-clone/civ1-unit/Actions';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  ruleRegistry?: RuleRegistry
) => Action[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Action[] => [
  // A Caravan can help build a Wonder in one of its owner's cities, whichever city it comes from (v474.05
  //  `PlayerTurn.cs` L1802-L1890, civ-clone/web-renderer#57).
  new Action(
    'civ1-wonder:unit/action/help-build-wonder',
    isNeighbouringTile,
    hasMovesLeft,
    new Criterion((unit: Unit): boolean => unit instanceof Caravan),
    new Criterion(
      (unit: Unit, to: Tile): boolean =>
        cityRegistry.getByTile(to)?.player() === unit.player()
    ),
    new Criterion((unit: Unit, to: Tile): boolean => {
      const building = cityBuildRegistry
        .getByCity(cityRegistry.getByTile(to)!)
        .building();

      return (
        building !== null &&
        Object.prototype.isPrototypeOf.call(Wonder, building.item())
      );
    }),
    new Effect(
      (unit: Unit, to: Tile, from: Tile = unit.tile()): UnitAction =>
        new HelpBuildWonder(
          from,
          to,
          unit,
          cityRegistry.getByTile(to)!,
          ruleRegistry
        ) as UnitAction
    )
  ),
];

export default getRules;
