import build from './Rules/City/build';
import buildCost from './Rules/City/build-cost';
import buildingComplete from './Rules/City/building-complete';
import cityYield from './Rules/City/yield';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import researchComplete from './Rules/Player/research-complete';
import unitYield from './Rules/Unit/yield';
import wonderObsolete from './Rules/Unit/yield';

ruleRegistryInstance.register(
  ...build(),
  ...buildCost(),
  ...buildingComplete(),
  ...cityYield(),
  ...researchComplete(),
  ...unitYield(),
  ...wonderObsolete()
);
