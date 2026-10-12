import { GreatWall, Pyramids, UnitedNations } from '../Wonders';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import { Gunpowder } from '@civ-clone/civ1-science/Advances';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import { expect } from 'chai';
import isPacified from '@civ-clone/library-diplomacy/lib/isPacified';
import pacified from '../Rules/Player/pacified';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

// An owner of `WonderType` (or of nothing) and a rival, whose research says what's known.
const setUp = async (WonderType: typeof Wonder | null) => {
  const ruleRegistry = new RuleRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    wonderRegistry = new WonderRegistry(),
    owner = new Player(ruleRegistry),
    rival = new Player(ruleRegistry),
    rivalResearch = new PlayerResearch(
      rival,
      new AdvanceRegistry(),
      ruleRegistry
    );

  ruleRegistry.register(...pacified(playerResearchRegistry, wonderRegistry));
  playerResearchRegistry.register(
    new PlayerResearch(owner, new AdvanceRegistry(), ruleRegistry),
    rivalResearch
  );

  if (WonderType !== null) {
    const city = await setUpCity({ player: owner, ruleRegistry });

    wonderRegistry.register(new WonderType(city, ruleRegistry));
  }

  return {
    owner,
    rival,
    rivalResearch,
    pacified: (player: Player, other: Player): boolean =>
      isPacified(player, other, ruleRegistry),
  };
};

describe('pacified (civ-clone/web-renderer#30)', (): void => {
  it("should pacify other leaders towards the Great Wall's owner until anyone discovers Gunpowder", async (): Promise<void> => {
    const { owner, rival, rivalResearch, pacified } = await setUp(GreatWall);

    expect(pacified(rival, owner)).true;

    rivalResearch.addAdvance(Gunpowder);

    expect(pacified(rival, owner)).false;
  });

  it("should pacify other leaders towards the United Nations' owner, whatever is known", async (): Promise<void> => {
    const { owner, rival, rivalResearch, pacified } = await setUp(
      UnitedNations
    );

    rivalResearch.addAdvance(Gunpowder);

    expect(pacified(rival, owner)).true;
  });

  it('should not pacify the owner, nor anyone towards a player with neither wonder', async (): Promise<void> => {
    const withWall = await setUp(GreatWall),
      withPyramids = await setUp(Pyramids),
      withNothing = await setUp(null);

    expect(withWall.pacified(withWall.owner, withWall.rival)).false;
    expect(withWall.pacified(withWall.owner, withWall.owner)).false;
    expect(withPyramids.pacified(withPyramids.rival, withPyramids.owner)).false;
    expect(withNothing.pacified(withNothing.rival, withNothing.owner)).false;
  });
});
