import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildingComplete from './Rules/City/building-complete';
import cityCost from './Rules/City/cost';
import cityDestroyed from './Rules/City/destroyed';
import cityYield from './Rules/City/yield';
import cityYieldModifier from './Rules/City/yield-modifier';
import playerResearchComplete from './Rules/Player/research-complete';
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
      game.engine
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
    ...playerResearchComplete(game.playerResearch, game.rules, game.wonders),
    ...unitYield(game.wonders, game.playerResearch),
    ...wonderObsolete(game.engine)
  );

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
