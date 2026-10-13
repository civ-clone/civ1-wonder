import { HooverDam } from '../Wonders';
import LandMass from '@civ-clone/core-world/LandMass';
import LandMassRegistry from '@civ-clone/core-world/LandMassRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PollutionDivisor from '@civ-clone/civ1-city-improvement/Rules/PollutionDivisor';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import { expect } from 'chai';
import pollutionDivisor from '../Rules/City/pollution-divisor';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

// civ-clone/web-renderer#32: Hoover Dam halves the shields that count towards pollution, as a Hydro Plant does.
describe('city:pollution-divisor', (): void => {
  it("halves pollution's shields in its owner's cities on its continent", async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      wonderRegistry = new WonderRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      landMassRegistry = new LandMassRegistry(),
      city = await setUpCity({ ruleRegistry }),
      world = city.tile().map(),
      sameContinent = await setUpCity({
        ruleRegistry,
        world,
        player: city.player(),
        tile: city.tile().getNeighbour('e').getNeighbour('e'),
      }),
      otherContinent = await setUpCity({
        ruleRegistry,
        world,
        player: city.player(),
        tile: city.tile().getNeighbour('s').getNeighbour('s'),
      }),
      rival = await setUpCity({
        ruleRegistry,
        world,
        tile: city.tile().getNeighbour('w').getNeighbour('w'),
      });

    ruleRegistry.register(
      ...pollutionDivisor(
        wonderRegistry,
        playerResearchRegistry,
        landMassRegistry
      )
    );
    [city, rival].forEach((owner) =>
      playerResearchRegistry.register(new PlayerResearch(owner.player()))
    );
    landMassRegistry.register(
      new LandMass([city.tile(), sameContinent.tile(), rival.tile()]),
      new LandMass([otherContinent.tile()])
    );

    expect(ruleRegistry.process(PollutionDivisor, city)).to.deep.equal([]);

    wonderRegistry.register(new HooverDam(city, ruleRegistry));

    expect(ruleRegistry.process(PollutionDivisor, city)).to.deep.equal([2]);
    expect(ruleRegistry.process(PollutionDivisor, sameContinent)).to.deep.equal(
      [2]
    );
    expect(
      ruleRegistry.process(PollutionDivisor, otherContinent)
    ).to.deep.equal([]);
    expect(ruleRegistry.process(PollutionDivisor, rival)).to.deep.equal([]);
  });
});
