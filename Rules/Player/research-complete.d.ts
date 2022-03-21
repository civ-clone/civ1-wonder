import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Complete from '@civ-clone/core-science/Rules/Complete';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry
) => Complete[];
export default getRules;
