import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import WonderHelped from '@civ-clone/base-unit-action-help-build-wonder/Rules/WonderHelped';
export declare const getRules: (
  cityBuildRegistry?: CityBuildRegistry,
  ruleRegistry?: RuleRegistry
) => WonderHelped[];
export default getRules;
