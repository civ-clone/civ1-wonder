import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildingComplete from './Rules/City/building-complete';
import cityCost from './Rules/City/cost';
import cityDestroyed from './Rules/City/destroyed';
import cityYield from './Rules/City/yield';
import cityYieldModifier from './Rules/City/yield-modifier';
import governmentsAvailability from './Rules/Governments/availability';
import playerAnarchyDuration from './Rules/Player/anarchy-duration';
import playerResearchComplete from './Rules/Player/research-complete';
import playerResearchStarted from './Rules/PlayerResearch/started';
import unitAction from './Rules/Unit/action';
import unitWonderHelped from './Rules/Unit/wonder-helped';
import unitYield from './Rules/Unit/yield';
import wonderObsolete from './Rules/Wonder/obsolete';
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityBuild(game.playerResearch, game.wonders),
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
      game.wonders
    ),
    ...cityDestroyed(game.wonders),
    ...cityYield(game.playerResearch, game.wonders),
    ...cityYieldModifier(game.playerResearch, game.wonders),
    ...governmentsAvailability(game.playerResearch, game.wonders),
    ...playerAnarchyDuration(game.playerResearch, game.wonders),
    ...playerResearchComplete(game.playerResearch, game.rules, game.wonders),
    ...playerResearchStarted(game.pendingEffects),
    ...unitAction(game.cities, game.cityBuilds, game.rules),
    ...unitWonderHelped(game.cityBuilds, game.rules),
    ...unitYield(game.wonders, game.playerResearch),
    ...wonderObsolete(game.engine)
  );

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
