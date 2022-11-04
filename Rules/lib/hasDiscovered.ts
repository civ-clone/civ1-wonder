import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Unit from '@civ-clone/core-unit/Unit';

export const discoveredByPlayer = (
  AdvanceType: typeof Advance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
) =>
  new Criterion((item: City | Unit): boolean =>
    playerResearchRegistry.getByPlayer(item.player()).completed(AdvanceType)
  );

export const notDiscoveredByAnyPlayer = (
  AdvanceType: typeof Advance | null,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
) =>
  new Criterion(
    (): boolean =>
      AdvanceType === null ||
      !playerResearchRegistry.some((playerResearch) =>
        playerResearch.completed(AdvanceType)
      )
  );

export const notDiscoveredByPlayer = (
  AdvanceType: typeof Advance | null,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
) =>
  new Criterion(
    (item: City | Unit): boolean =>
      AdvanceType === null ||
      !playerResearchRegistry.getByPlayer(item.player()).completed(AdvanceType)
  );
