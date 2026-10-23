import { instance as requirementRegistryInstance } from '@civ-clone/core-requirement/RequirementRegistry';
import { obsoletedBy } from '../../Requirements';

// The rules here read when a Wonder is obsolete from the game's requirements (civ-clone/web-renderer#37), as a game has
//  them once `registerRules` has run. The suites build rules straight from the factories, which default to the module
//  registry, so it is given the obsolete entries here, once however many suites import it. They only describe: no
//  rules are made from them, so they don't add to the rules a suite registers.
if (requirementRegistryInstance.getById(obsoletedBy[0].id) === null) {
  requirementRegistryInstance.add(null, ...obsoletedBy);
}
