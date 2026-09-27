import { cityHasWonder, playerHasWonder } from '../Rules/lib/hasWonder';
import { isObsolete, obsoletedBy } from '../Rules/lib/obsolete';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('obsolete wonders', (): void =>
  obsoletedBy.forEach(
    ([WonderType, ObsoletingAdvance]: [typeof Wonder, typeof Advance]): void =>
      it(`should stop ${WonderType.name} working once anyone discovers ${ObsoletingAdvance.name}`, async (): Promise<void> => {
        const ruleRegistry = new RuleRegistry(),
          advanceRegistry = new AdvanceRegistry(),
          wonderRegistry = new WonderRegistry(),
          playerResearchRegistry = new PlayerResearchRegistry(),
          [ownerResearch, otherResearch] = [
            new Player(ruleRegistry),
            new Player(ruleRegistry),
          ].map(
            (player: Player): PlayerResearch =>
              new PlayerResearch(player, advanceRegistry, ruleRegistry)
          ),
          city = await setUpCity({
            player: ownerResearch.player(),
            ruleRegistry,
          }),
          inCity = cityHasWonder(
            WonderType,
            wonderRegistry,
            playerResearchRegistry
          ),
          forPlayer = playerHasWonder(
            WonderType,
            wonderRegistry,
            playerResearchRegistry
          );

        playerResearchRegistry.register(ownerResearch, otherResearch);
        wonderRegistry.register(new WonderType(city, ruleRegistry));

        expect(isObsolete(WonderType, playerResearchRegistry)).to.false;
        expect(inCity.validate(city)).to.true;
        expect(forPlayer.validate(city)).to.true;

        // Not the owner: anyone's discovery counts.
        otherResearch.addAdvance(ObsoletingAdvance);

        expect(isObsolete(WonderType, playerResearchRegistry)).to.true;
        expect(inCity.validate(city)).to.false;
        expect(forPlayer.validate(city)).to.false;
      })
  ));
