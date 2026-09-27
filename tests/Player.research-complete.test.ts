import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import {
  Alphabet,
  Electricity,
  University,
} from '@civ-clone/civ1-science/Advances';
import { Colossus, GreatLibrary } from '../Wonders';
import Effect from '@civ-clone/core-rule/Effect';
import Obsolete from '@civ-clone/core-wonder/Rules/Obsolete';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import { expect } from 'chai';
import researchComplete from '../Rules/Player/research-complete';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('Player.research-complete', (): void => {
  it('should grant a technology to the Player that owns the GreatLibrary when at least three other players have discovered it', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      advanceRegistry = new AdvanceRegistry(),
      wonderRegistry = new WonderRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      [player1Research, player2Research, player3Research, player4Research] = [
        new Player(ruleRegistry),
        new Player(ruleRegistry),
        new Player(ruleRegistry),
        new Player(ruleRegistry),
      ].map(
        (player: Player): PlayerResearch =>
          new PlayerResearch(player, advanceRegistry, ruleRegistry)
      ),
      city = await setUpCity({
        player: player1Research.player(),
        ruleRegistry,
      });

    ruleRegistry.register(
      ...researchComplete(playerResearchRegistry, ruleRegistry, wonderRegistry)
    );

    playerResearchRegistry.register(
      player1Research,
      player2Research,
      player3Research,
      player4Research
    );

    wonderRegistry.register(new GreatLibrary(city, ruleRegistry));

    expect(player1Research.completed(Alphabet)).to.false;

    (
      [
        [player2Research, false],
        [player3Research, false],
        [player4Research, true],
      ] as [PlayerResearch, boolean][]
    ).forEach(
      ([playerResearch, expectedCompletion]: [
        PlayerResearch,
        boolean
      ]): void => {
        playerResearch.addAdvance(Alphabet);

        expect(player1Research.completed(Alphabet)).to.equal(
          expectedCompletion
        );
      }
    );
  });

  it('should stop granting technologies once anyone discovers University', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      advanceRegistry = new AdvanceRegistry(),
      wonderRegistry = new WonderRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      [player1Research, player2Research, player3Research, player4Research] = [
        new Player(ruleRegistry),
        new Player(ruleRegistry),
        new Player(ruleRegistry),
        new Player(ruleRegistry),
      ].map(
        (player: Player): PlayerResearch =>
          new PlayerResearch(player, advanceRegistry, ruleRegistry)
      ),
      city = await setUpCity({
        player: player1Research.player(),
        ruleRegistry,
      });

    ruleRegistry.register(
      ...researchComplete(playerResearchRegistry, ruleRegistry, wonderRegistry)
    );

    playerResearchRegistry.register(
      player1Research,
      player2Research,
      player3Research,
      player4Research
    );

    wonderRegistry.register(new GreatLibrary(city, ruleRegistry));

    player2Research.addAdvance(University);

    [player2Research, player3Research, player4Research].forEach(
      (playerResearch: PlayerResearch): void =>
        playerResearch.addAdvance(Alphabet)
    );

    expect(player1Research.completed(Alphabet)).to.false;
  });

  it('should make a Wonder obsolete only when the obsoleting Advance is first discovered', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      advanceRegistry = new AdvanceRegistry(),
      wonderRegistry = new WonderRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      playerResearches = [
        new Player(ruleRegistry),
        new Player(ruleRegistry),
        new Player(ruleRegistry),
      ].map(
        (player: Player): PlayerResearch =>
          new PlayerResearch(player, advanceRegistry, ruleRegistry)
      ),
      city = await setUpCity({
        player: playerResearches[0].player(),
        ruleRegistry,
      });

    let obsoleted = 0;

    ruleRegistry.register(
      ...researchComplete(playerResearchRegistry, ruleRegistry, wonderRegistry),
      new Obsolete(new Effect((): void => void obsoleted++))
    );

    playerResearchRegistry.register(...playerResearches);

    wonderRegistry.register(new Colossus(city, ruleRegistry));

    playerResearches.forEach((playerResearch: PlayerResearch): void =>
      playerResearch.addAdvance(Electricity)
    );

    expect(obsoleted).to.equal(1);
  });
});
