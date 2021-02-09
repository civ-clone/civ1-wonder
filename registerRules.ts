import build from './Rules/City/build';
import buildingComplete from './Rules/City/building-complete';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';

ruleRegistryInstance.register(...build(), ...buildingComplete());
