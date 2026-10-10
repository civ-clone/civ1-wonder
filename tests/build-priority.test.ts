import { Lighthouse, ManhattanProject, Pyramids } from '../Wonders';
import BuildPriority from '@civ-clone/core-city-build/Rules/BuildPriority';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { Production } from '@civ-clone/civ1-city/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Trireme } from '@civ-clone/civ1-unit/Units';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import buildPriority from '../Rules/City/build-priority';
import { expect } from 'chai';

describe('city:build-priority (Wonders)', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      player = new Player(ruleRegistry),
      city = { player: (): Player => player } as unknown as City,
      other = { player: (): Player => player } as unknown as City,
      building = new Map<City, typeof Wonder | null>(),
      units: Unit[] = [],
      cityBuild = { city: (): City => city } as unknown as CityBuild;

    ruleRegistry.register(
      ...buildPriority(
        { getByPlayer: (): City[] => [city, other] } as unknown as CityRegistry,
        {
          getByCity: (city: City) => ({
            building: () =>
              building.get(city) ? { item: () => building.get(city) } : null,
          }),
        } as unknown as CityBuildRegistry,
        new PlayerResearchRegistry(),
        { getByPlayer: (): Unit[] => units } as unknown as UnitRegistry
      )
    );

    const score = (WonderType: typeof Wonder, shields: number): number =>
      ruleRegistry
        .process(BuildPriority, cityBuild, WonderType as any, [
          new Production(shields),
        ])
        .reduce((total: number, value: number): number => total + value, 0);

    return { building, other, ruleRegistry, score, units };
  };

  it('should want a useful Wonder in a city with the shields for it', (): void => {
    const { score } = setUp();

    expect(score(Pyramids, 6)).greaterThan(0);
    expect(score(Pyramids, 3)).equal(0);
  });

  it("should not want a Wonder another of the player's cities is building", (): void => {
    const { building, other, score } = setUp();

    building.set(other, Pyramids);

    expect(score(Pyramids, 6)).equal(0);
  });

  it('should only want the Lighthouse with ships, and never the Manhattan Project', (): void => {
    const { ruleRegistry, score, units } = setUp();

    expect(score(Lighthouse, 6)).equal(0);
    expect(score(ManhattanProject, 6)).equal(0);

    units.push(new Trireme(null, null as any, null as any, ruleRegistry));

    expect(score(Lighthouse, 6)).greaterThan(0);
  });
});
