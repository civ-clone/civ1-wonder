import { GreatWall, ManhattanProject, Pyramids } from '../Wonders';
import { Gunpowder, NuclearFission } from '@civ-clone/civ1-science/Advances';
import {
  buildRequirements,
  obsoletedBy,
  requiresAdvance,
  requiresWonder,
} from '../Requirements';
import Build from '@civ-clone/core-city-build/Rules/Build';
import Complete from '@civ-clone/core-science/Rules/Complete';
import { Game } from '@civ-clone/core-game/Game';
import { Nuclear } from '@civ-clone/civ1-unit/Units';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import Rule from '@civ-clone/core-rule/Rule';
import { expect } from 'chai';
import getBuildRules from '../Rules/City/build';
import getResearchCompleteRules from '../Rules/Player/research-complete';
import { isObsolete } from '../Rules/lib/obsolete';
import register from '../registerRules';

// Through `register(game)`, as a game gets them: the entries in `game.requirements`, and the rules made from them in
//  `game.rules` under the same ids (civ-clone/web-renderer#37).
const setUp = () => {
  const game = new Game();

  register(game);

  const player = new Player(game.rules),
    research = new PlayerResearch(player, game.advances, game.rules);

  game.playerResearch.register(research);

  return { game, research };
};

const ids = (rules: Rule[]): (string | null)[] =>
  rules.map((rule: Rule): string | null => rule.id());

describe('civ1-wonder requirements', (): void => {
  it('should make one rule for each entry, under its id', (): void => {
    const { game } = setUp();

    [...buildRequirements, ...obsoletedBy].forEach(
      (entry: Requirement): void => {
        const rules = game.requirements.rulesFor(entry.id);

        expect(rules, entry.id).length(1);
        expect(game.rules.getById(entry.id), entry.id).equal(rules[0]);
      }
    );

    expect(requiresAdvance.length).equal(21);
    expect(obsoletedBy.length).equal(11);
    expect(requiresWonder.map((entry) => [entry.subject, entry.range])).eql([
      [Nuclear, 'world'],
    ]);
    expect(obsoletedBy.every((entry) => entry.range === 'world')).true;
  });

  it('should register the rules in the order they always were, now named', (): void => {
    const { game } = setUp();

    // Written out from the tables as \`Rules/City/build\` and \`Rules/lib/obsolete\` had them, so a reordered table
    //  fails here.
    expect(ids(getBuildRules())).eql([
      'civ1-wonder:city/build/once',
      'civ1-wonder:city/build/requires-advance/Colossus',
      'civ1-wonder:city/build/requires-advance/CopernicusObservatory',
      'civ1-wonder:city/build/requires-advance/GreatLibrary',
      'civ1-wonder:city/build/requires-advance/GreatWall',
      'civ1-wonder:city/build/requires-advance/HangingGardens',
      'civ1-wonder:city/build/requires-advance/Lighthouse',
      'civ1-wonder:city/build/requires-advance/MagellansExpedition',
      'civ1-wonder:city/build/requires-advance/Oracle',
      'civ1-wonder:city/build/requires-advance/Pyramids',
      'civ1-wonder:city/build/requires-advance/ApolloProgram',
      'civ1-wonder:city/build/requires-advance/CureForCancer',
      'civ1-wonder:city/build/requires-advance/DarwinsVoyage',
      'civ1-wonder:city/build/requires-advance/HooverDam',
      'civ1-wonder:city/build/requires-advance/IsaacNewtonsCollege',
      'civ1-wonder:city/build/requires-advance/JsBachsCathedral',
      'civ1-wonder:city/build/requires-advance/ManhattanProject',
      'civ1-wonder:city/build/requires-advance/MichelangelosChapel',
      'civ1-wonder:city/build/requires-advance/SetiProgram',
      'civ1-wonder:city/build/requires-advance/ShakespearesTheatre',
      'civ1-wonder:city/build/requires-advance/UnitedNations',
      'civ1-wonder:city/build/requires-advance/WomensSuffrage',
      'civ1-wonder:city/build/requires-wonder/Nuclear',
      'civ1-wonder:city/build/hoover-dam-plant/PowerPlant',
      'civ1-wonder:city/build/hoover-dam-plant/HydroPlant',
      'civ1-wonder:city/build/hoover-dam-plant/NuclearPlant',
    ]);
    expect(
      ids(game.rules.get(Build)).filter((id) =>
        (id ?? '').startsWith('civ1-wonder:')
      )
    ).eql(ids(getBuildRules()));
    expect(ids(getResearchCompleteRules())).eql([
      null,
      ...[
        'civ1-wonder:wonder/obsolete/Colossus',
        'civ1-wonder:wonder/obsolete/CopernicusObservatory',
        'civ1-wonder:wonder/obsolete/GreatLibrary',
        'civ1-wonder:wonder/obsolete/GreatWall',
        'civ1-wonder:wonder/obsolete/HangingGardens',
        'civ1-wonder:wonder/obsolete/IsaacNewtonsCollege',
        'civ1-wonder:wonder/obsolete/Lighthouse',
        'civ1-wonder:wonder/obsolete/MichelangelosChapel',
        'civ1-wonder:wonder/obsolete/Oracle',
        'civ1-wonder:wonder/obsolete/Pyramids',
        'civ1-wonder:wonder/obsolete/ShakespearesTheatre',
      ],
    ]);
    expect(
      ids(game.rules.get(Complete)).filter((id) =>
        (id ?? '').startsWith('civ1-wonder:wonder/obsolete/')
      )
    ).eql(obsoletedBy.map((entry) => entry.id));
  });

  it("should make a Wonder obsolete as the game's requirements say, once anyone has the advance", (): void => {
    const { game, research } = setUp();

    expect(isObsolete(GreatWall, game.playerResearch, game.requirements)).false;

    research.addAdvance(Gunpowder);

    expect(isObsolete(GreatWall, game.playerResearch, game.requirements)).true;
    expect(isObsolete(Pyramids, game.playerResearch, game.requirements)).false;

    // A plugin that keeps the Great Wall going until Nuclear Fission changes play too.
    game.requirements.replace(
      'civ1-wonder:wonder/obsolete/GreatWall',
      new Requirement({
        id: 'civ1-wonder:wonder/obsolete/GreatWall',
        subject: GreatWall,
        relation: 'obsoletedBy',
        targets: [NuclearFission],
        range: 'world',
      })
    );

    expect(isObsolete(GreatWall, game.playerResearch, game.requirements)).false;
  });

  it("should refuse an obsolete entry that is not the world's, as obsolescence here is", (): void => {
    const { game } = setUp();

    expect(() =>
      game.requirements.replace(
        'civ1-wonder:wonder/obsolete/GreatWall',
        new Requirement({
          id: 'civ1-wonder:wonder/obsolete/GreatWall',
          subject: GreatWall,
          relation: 'obsoletedBy',
          targets: [Gunpowder],
          range: 'player',
        })
      )
    ).to.throw(TypeError, /range must be 'world'/);
    expect(
      game.requirements.getById('civ1-wonder:wonder/obsolete/GreatWall')?.range
    ).equal('world');
  });

  it('should read the graph both ways', (): void => {
    const { game } = setUp();

    expect(
      game.requirements
        .leadsTo(Gunpowder)
        .map((entry: Requirement): string => entry.id)
    ).eql(['civ1-wonder:wonder/obsolete/GreatWall']);
    expect(
      game.requirements
        .leadsTo(ManhattanProject)
        .map((entry: Requirement): string => entry.id)
    ).eql(['civ1-wonder:city/build/requires-wonder/Nuclear']);
  });
});
