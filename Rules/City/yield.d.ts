import { RequirementRegistry } from '@civ-clone/core-requirement/RequirementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Wonder from '@civ-clone/core-wonder/Wonder';
/** The trade the Colossus adds to each square its city works that already gives trade. */
export declare const colossusTrade: number;
/** The happy citizen each of these adds to every city of its owner. */
export declare const happinessWonders: [typeof Wonder, number][];
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  wonderRegistry?: WonderRegistry,
  requirementRegistry?: RequirementRegistry
) => CityYield[];
export default getRules;
