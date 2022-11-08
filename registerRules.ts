import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildingComplete from './Rules/City/building-complete';
import cityCost from './Rules/City/cost';
import cityDestroyed from './Rules/City/destroyed';
import cityYield from './Rules/City/yield';
import cityYieldModifier from './Rules/City/yield-modifier';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import playerResearchComplete from './Rules/Player/research-complete';
import unitYield from './Rules/Unit/yield';
import wonderObsolete from './Rules/Wonder/obsolete';

ruleRegistryInstance.register(
  ...cityBuild(),
  ...cityBuildCost(),
  ...cityBuildingComplete(),
  ...cityCost(),
  ...cityDestroyed(),
  ...cityYield(),
  ...cityYieldModifier(),
  ...playerResearchComplete(),
  ...unitYield(),
  ...wonderObsolete()
);
