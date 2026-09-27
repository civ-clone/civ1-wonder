import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '@civ-clone/civ1-government/Governments';
import {
  ChooseGovernment,
  Revolution,
} from '@civ-clone/civ1-government/PlayerActions';
import {
  chooseGovernment,
  revolution,
} from '@civ-clone/civ1-government/lib/revolution';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableGovernmentRegistry from '@civ-clone/core-government/AvailableGovernmentRegistry';
import { Communism as CommunismAdvance } from '@civ-clone/civ1-science/Advances';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { Pyramids } from '../Wonders';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import action from '@civ-clone/civ1-government/Rules/Player/action';
import anarchyDuration from '../Rules/Player/anarchy-duration';
import availability from '../Rules/Governments/availability';
import baseAnarchyDuration from '@civ-clone/civ1-government/Rules/Player/anarchy-duration';
import baseAvailability from '@civ-clone/civ1-government/Rules/Governments/availability';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

const setUp = async (withPyramids: boolean) => {
  const ruleRegistry = new RuleRegistry(),
    availableGovernmentRegistry = new AvailableGovernmentRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    pendingEffectRegistry = new PendingEffectRegistry(),
    wonderRegistry = new WonderRegistry(),
    turn = new Turn(),
    player = new Player(ruleRegistry),
    rival = new Player(ruleRegistry),
    playerGovernment = new PlayerGovernment(
      player,
      availableGovernmentRegistry,
      ruleRegistry
    ),
    rivalResearch = new PlayerResearch(
      rival,
      new AdvanceRegistry(),
      ruleRegistry
    );

  availableGovernmentRegistry.register(
    Anarchy,
    Communism,
    Democracy,
    Despotism,
    Monarchy,
    Republic
  );

  ruleRegistry.register(
    ...action(playerGovernmentRegistry, pendingEffectRegistry, turn),
    ...baseAnarchyDuration(() => 0),
    ...baseAvailability(playerResearchRegistry),
    ...anarchyDuration(playerResearchRegistry, wonderRegistry),
    ...availability(playerResearchRegistry, wonderRegistry)
  );

  playerGovernment.set(new Despotism());
  playerGovernmentRegistry.register(playerGovernment);
  playerResearchRegistry.register(
    new PlayerResearch(player, new AdvanceRegistry(), ruleRegistry),
    rivalResearch
  );

  if (withPyramids) {
    const city = await setUpCity({ player, ruleRegistry });

    wonderRegistry.register(new Pyramids(city, ruleRegistry));
  }

  const start = (): void =>
    revolution(playerGovernment, pendingEffectRegistry, ruleRegistry, turn);

  return {
    pendingEffectRegistry,
    player,
    playerGovernment,
    rivalResearch,
    start,
    turn,
  };
};

describe('Pyramids and changing government', (): void => {
  it('should go through Anarchy without the Pyramids, choosing only from known governments', async (): Promise<void> => {
    const { player, playerGovernment, start } = await setUp(false);

    start();

    expect(playerGovernment.is(Anarchy)).true;
    expect(
      player.actions().some((action) => action instanceof ChooseGovernment)
    ).false;
    expect(playerGovernment.available()).to.deep.equal([Despotism]);
  });

  it('should skip Anarchy and offer all five governments with the Pyramids', async (): Promise<void> => {
    const { pendingEffectRegistry, player, playerGovernment, start, turn } =
      await setUp(true);

    expect(playerGovernment.available()).to.have.members([
      Communism,
      Democracy,
      Despotism,
      Monarchy,
      Republic,
    ]);

    start();

    expect(playerGovernment.is(Despotism)).true;
    expect(
      player.actions().some((action) => action instanceof ChooseGovernment)
    ).true;
    expect(player.actions().some((action) => action instanceof Revolution))
      .false;

    chooseGovernment(playerGovernment, Democracy, pendingEffectRegistry, turn);

    expect(playerGovernment.is(Democracy)).true;
  });

  it('should stop working once anyone discovers Communism', async (): Promise<void> => {
    const { playerGovernment, rivalResearch, start } = await setUp(true);

    rivalResearch.addAdvance(CommunismAdvance);

    expect(playerGovernment.available()).to.deep.equal([Despotism]);

    start();

    expect(playerGovernment.is(Anarchy)).true;
  });
});
