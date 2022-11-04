import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Unit from '@civ-clone/core-unit/Unit';
export declare const discoveredByPlayer: (
  AdvanceType: typeof Advance,
  playerResearchRegistry?: PlayerResearchRegistry
) => Criterion<[item: City | Unit]>;
export declare const notDiscoveredByAnyPlayer: (
  AdvanceType: typeof Advance | null,
  playerResearchRegistry?: PlayerResearchRegistry
) => Criterion<[]>;
export declare const notDiscoveredByPlayer: (
  AdvanceType: typeof Advance | null,
  playerResearchRegistry?: PlayerResearchRegistry
) => Criterion<[item: City | Unit]>;
