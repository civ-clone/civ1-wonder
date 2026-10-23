import {
  builtOnceRule,
  deriveBuildRules,
  hooverDamPlantRules,
} from './Rules/City/build';
import { buildRequirements, obsoletedBy } from './Requirements';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildPriority from './Rules/City/build-priority';
import cityBuildingComplete from './Rules/City/building-complete';
import cityCost from './Rules/City/cost';
import cityDestroyed from './Rules/City/destroyed';
import cityYield from './Rules/City/yield';
import cityPollutionDivisor from './Rules/City/pollution-divisor';
import cityYieldModifier from './Rules/City/yield-modifier';
import governmentsAvailability from './Rules/Governments/availability';
import playerAnarchyDuration from './Rules/Player/anarchy-duration';
import playerPacified from './Rules/Player/pacified';
import {
  deriveObsoleteRules,
  greatLibraryRules,
} from './Rules/Player/research-complete';
import playerResearchStarted from './Rules/PlayerResearch/started';
import unitAction from './Rules/Unit/action';
import unitWonderHelped from './Rules/Unit/wonder-helped';
import unitYield from './Rules/Unit/yield';
import wonderObsolete from './Rules/Wonder/obsolete';
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void => {
  game.rules.register(builtOnceRule(game.wonders));

  // Which Wonders a city may build, and what they make buildable, from the entries in `Requirements`; then, below,
  //  their obsolescence. Each lands where those rules always were, so nothing else moves in the order rules run
  //  (civ-clone/web-renderer#37).
  game.requirements.add(
    deriveBuildRules(game.playerResearch, game.wonders),
    ...buildRequirements
  );

  game.rules.register(
    ...hooverDamPlantRules(
      game.playerResearch,
      game.wonders,
      game.landMasses,
      game.requirements
    ),
    ...cityBuildPriority(
      game.cities,
      game.cityBuilds,
      game.playerResearch,
      game.units,
      game.requirements
    ),
    ...cityBuildCost(),
    ...cityBuildingComplete(
      game.cityBuilds,
      game.playerResearch,
      game.rules,
      game.wonders,
      game.engine,
      game.pendingEffects
    ),
    ...cityCost(
      game.cityImprovements,
      game.playerGovernments,
      game.playerResearch,
      game.units,
      game.wonders,
      game.landMasses,
      game.requirements
    ),
    ...cityDestroyed(game.wonders),
    ...cityPollutionDivisor(
      game.wonders,
      game.playerResearch,
      game.landMasses,
      game.requirements
    ),
    ...cityYield(game.playerResearch, game.wonders, game.requirements),
    ...cityYieldModifier(
      game.playerResearch,
      game.wonders,
      game.cityImprovements,
      game.landMasses,
      game.requirements
    ),
    ...governmentsAvailability(
      game.playerResearch,
      game.wonders,
      game.requirements
    ),
    ...playerAnarchyDuration(
      game.playerResearch,
      game.wonders,
      game.requirements
    ),
    ...playerPacified(game.playerResearch, game.wonders, game.requirements),
    ...greatLibraryRules(
      game.playerResearch,
      game.rules,
      game.wonders,
      game.requirements
    )
  );

  game.requirements.add(
    deriveObsoleteRules(game.playerResearch, game.rules, game.wonders),
    ...obsoletedBy
  );

  game.rules.register(
    ...playerResearchStarted(game.pendingEffects),
    ...unitAction(game.cities, game.cityBuilds, game.rules),
    ...unitWonderHelped(game.cityBuilds, game.rules),
    ...unitYield(game.wonders, game.playerResearch, game.requirements),
    ...wonderObsolete(game.engine)
  );
};

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
