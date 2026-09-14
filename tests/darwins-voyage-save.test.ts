import {
  PendingEffect,
  PendingEffectRegistry,
} from '@civ-clone/core-pending-effect';
import {
  DARWINS_VOYAGE,
  spendFreeResearch,
} from '../Rules/PlayerResearch/started';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import { expect } from 'chai';
import { gameForLoad } from '@civ-clone/core-save-game/gameForLoad';
import { hydrate } from '@civ-clone/core-save-game/hydrate';
import { registerClasses } from '@civ-clone/core-save-game/registerClasses';
import { save } from '@civ-clone/core-save-game/save';

/**
 * Darwin's Voyage used to grant its two free research completions by
 * registering a one-shot rule that registered another one-shot rule, each
 * closing over the `PlayerResearch` it applied to. The only record of the
 * grant was a closure in the rule registry, so a save taken between finishing
 * the wonder and starting the next research lost it silently — the player
 * simply never got their advances.
 *
 * `building-complete.test.ts` covers the grant itself. This covers the reason
 * it was rebuilt: that what records it now survives being written to a file.
 */
describe("Darwin's Voyage across a save", (): void => {
  const owed = (game: Game): PendingEffect[] =>
    game.pendingEffects
      .entries()
      .filter(
        (pendingEffect: PendingEffect): boolean =>
          pendingEffect.handler() === DARWINS_VOYAGE
      );

  const gameWithDebt = (): { game: Game; playerResearch: PlayerResearch } => {
    const game = new Game();
    const player = new Player(game.rules);
    const playerResearch = new PlayerResearch(
      player,
      new AdvanceRegistry(),
      game.rules
    );

    // Deliberately not registered in `game.players`: this player has no
    // civilisation, and `hydrate`'s claim-replaying pass reads one from every
    // player in that registry. A player without one cannot occur in a real
    // game — `civ1-player` assigns a civilisation as the player is created —
    // so hardening that pass would only hide a genuinely broken save. The
    // player still reaches the file as the research's owner.
    game.playerResearch.register(playerResearch);

    game.pendingEffects.handler(DARWINS_VOYAGE, (pendingEffect) =>
      (pendingEffect.target() as PlayerResearch).add(
        (pendingEffect.target() as PlayerResearch).cost()
      )
    );
    game.pendingEffects.register(
      new PendingEffect(DARWINS_VOYAGE, playerResearch, { remaining: '2' })
    );

    // `save` refuses without a manifest, because an empty one means "cannot
    // check compatibility" rather than "nothing loaded".
    game.engine.registerPlugins({ '@civ-clone/civ1-wonder': '0.1.2' });
    registerClasses(game);

    return { game, playerResearch };
  };

  it('should record the debt rather than hold it in a closure', (): void => {
    const { game, playerResearch } = gameWithDebt();
    const [pendingEffect] = owed(game);

    expect(pendingEffect).not.to.be.undefined;
    expect(pendingEffect.data().remaining).to.equal('2');
    expect(pendingEffect.target()).to.equal(playerResearch);
  });

  it('should write the debt to the file', (): void => {
    const { game, playerResearch } = gameWithDebt();
    const [entity] = save(game, { name: 'darwins' }).entities.filter(
      ({ type }): boolean => type === 'PendingEffect'
    );

    expect(entity).not.to.be.undefined;
    expect((entity.state._data as { remaining?: string }).remaining).to.equal(
      '2'
    );
    // A `$ref`, so it comes back as the restored research rather than a copy.
    expect((entity.state._target as { $ref?: string }).$ref).to.equal(
      playerResearch.id()
    );
  });

  it('should keep the debt across a save and load', (): void => {
    const { game, playerResearch } = gameWithDebt();
    const loaded = gameForLoad({
      classes: game.classes,
      engine: game.engine,
      rules: game.rules,
    });

    hydrate(save(game, { name: 'darwins' }), loaded);

    const [restored] = owed(loaded);

    expect(restored).not.to.be.undefined;
    expect(restored.data().remaining).to.equal('2');
    expect(restored.target()?.id()).to.equal(playerResearch.id());
  });

  it('should still be spendable after a load', (): void => {
    // The point of the whole exercise: a debt that survives but cannot be
    // discharged would be no better than one that was lost.
    const { game } = gameWithDebt();
    const loaded = gameForLoad({
      classes: game.classes,
      engine: game.engine,
      rules: game.rules,
    });

    loaded.pendingEffects.handler(DARWINS_VOYAGE, () => {});
    hydrate(save(game, { name: 'darwins' }), loaded);

    const [restored] = owed(loaded);
    const research = restored.target() as PlayerResearch;

    spendFreeResearch(research, restored, loaded.pendingEffects);

    expect(owed(loaded)[0].data().remaining).to.equal('1');

    spendFreeResearch(research, owed(loaded)[0], loaded.pendingEffects);

    expect(owed(loaded)).to.have.length(0);
  });
});
