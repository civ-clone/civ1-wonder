import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Complete from '@civ-clone/core-science/Rules/Complete';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry
) => Complete[];
export default getRules;
