// Must come first: what makes a Wonder obsolete is read from the game's requirements.
import './lib/requirements';

import {
  GREAT_WALL_PACIFIED_RULE,
  UNITED_NATIONS_PACIFIED_RULE,
} from '../RuleIds';
import { GreatWall, Pyramids, UnitedNations } from '../Wonders';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
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

type Seat = 'human' | 'computer' | 'none';

// An owner of `WonderType` (or of nothing) and a rival, whose research says what's known. The owner's seat is a
//  person's unless told otherwise (`none`: a player with no client), the rival's the computer's.
const setUp = async (
  WonderType: typeof Wonder | null,
  ownerSeat: Seat = 'human'
) => {
  const ruleRegistry = new RuleRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    wonderRegistry = new WonderRegistry(),
    clientRegistry = new ClientRegistry(),
    owner = new Player(ruleRegistry),
    rival = new Player(ruleRegistry),
    rivalResearch = new PlayerResearch(
      rival,
      new AdvanceRegistry(),
      ruleRegistry
    );

  ruleRegistry.register(
    ...pacified(
      playerResearchRegistry,
      wonderRegistry,
      undefined,
      clientRegistry
    )
  );

  if (ownerSeat === 'human') {
    clientRegistry.register(new Client(owner));
  }

  if (ownerSeat === 'computer') {
    clientRegistry.register(new AIClient(owner));
  }

  clientRegistry.register(new AIClient(rival));
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

  it("should pacify other leaders towards the Great Wall's owner whoever plays it, as v474.05 does in the human's parley and between computer players", async (): Promise<void> => {
    for (const seat of ['human', 'computer', 'none'] as Seat[]) {
      const { owner, rival, pacified } = await setUp(GreatWall, seat);

      expect(pacified(rival, owner), seat).true;
    }
  });

  it("should pacify a computer player's leader towards the human owner of the United Nations, whatever is known", async (): Promise<void> => {
    const { owner, rival, rivalResearch, pacified } = await setUp(
      UnitedNations
    );

    rivalResearch.addAdvance(Gunpowder);

    expect(pacified(rival, owner)).true;
  });

  it('should not pacify anyone towards a computer player that owns the United Nations, as v474.05 (civ-clone/web-renderer#960)', async (): Promise<void> => {
    for (const seat of ['computer', 'none'] as Seat[]) {
      const { owner, rival, pacified } = await setUp(UnitedNations, seat);

      expect(pacified(rival, owner), seat).false;
    }
  });

  it('should not pacify the owner of the United Nations towards anyone', async (): Promise<void> => {
    const { owner, rival, pacified } = await setUp(UnitedNations);

    expect(pacified(owner, rival)).false;
    expect(pacified(owner, owner)).false;
  });

  it('should export the ids of both rules', (): void => {
    expect(GREAT_WALL_PACIFIED_RULE).to.equal(
      'civ1-wonder:player/pacified/great-wall'
    );
    expect(UNITED_NATIONS_PACIFIED_RULE).to.equal(
      'civ1-wonder:player/pacified/united-nations'
    );
    expect(pacified().map((rule) => rule.id())).to.eql([
      GREAT_WALL_PACIFIED_RULE,
      UNITED_NATIONS_PACIFIED_RULE,
    ]);
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
