import { MagellansExpedition } from '../Wonders';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Trireme } from '@civ-clone/civ1-unit/Units';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import unitYield from '@civ-clone/civ1-unit/Rules/Unit/yield';
import wonderUnitYield from '../Rules/Unit/yield';

describe('MagellansExpedition', (): void => {
  it('should provide an additional move for NavalUnits', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      player = new Player(ruleRegistry),
      city = await setUpCity({
        player,
        ruleRegistry,
      });

    ruleRegistry.register(...unitYield(), ...wonderUnitYield(wonderRegistry));

    const unit = new Trireme(null, player, city.tile(), ruleRegistry);

    expect(unit.movement().value()).to.equal(3);

    wonderRegistry.register(
      new MagellansExpedition(city.player(), city, ruleRegistry)
    );

    expect(unit.movement().value()).to.equal(4);
  });
});
