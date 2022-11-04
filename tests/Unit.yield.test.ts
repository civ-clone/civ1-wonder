import { Lighthouse, MagellansExpedition } from '../Wonders';
import Advance from '@civ-clone/core-science/Advance';
import { Magnetism } from '@civ-clone/civ1-science/Advances';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Trireme } from '@civ-clone/civ1-unit/Units';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import unitYield from '@civ-clone/civ1-unit/Rules/Unit/yield';
import wonderUnitYield from '../Rules/Unit/yield';

describe('Unit.yield', (): void =>
  (
    [
      [Lighthouse, 1, Magnetism],
      [MagellansExpedition, 1, null],
    ] as [typeof Wonder, number, typeof Advance | null][]
  ).forEach(([WonderType, increase, ObsoletingAdvance]) =>
    it(`should provide ${increase} additional move for NavalUnits when ${WonderType.name} is owned by the Player`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        wonderRegistry = new WonderRegistry(),
        player = new Player(ruleRegistry),
        playerResearchRegistry = new PlayerResearchRegistry(),
        playerResearch = new PlayerResearch(player),
        city = await setUpCity({
          player,
          ruleRegistry,
        });

      playerResearchRegistry.register(playerResearch);

      ruleRegistry.register(
        ...unitYield(),
        ...wonderUnitYield(wonderRegistry, playerResearchRegistry)
      );

      const unit = new Trireme(null, player, city.tile(), ruleRegistry);

      expect(unit.movement().value()).to.equal(3);

      wonderRegistry.register(new Lighthouse(city, ruleRegistry));

      expect(unit.movement().value()).to.equal(3 + increase);

      if (WonderType === Lighthouse) {
        const magellansExpedition = new MagellansExpedition(city, ruleRegistry);

        wonderRegistry.register(magellansExpedition);

        expect(unit.movement().value()).to.equal(3 + increase + 1);

        wonderRegistry.unregister(magellansExpedition);
      }

      if (ObsoletingAdvance !== null) {
        playerResearch.addAdvance(ObsoletingAdvance);

        expect(unit.movement().value()).to.equal(3);
      }
    })
  ));
