import * as Wonders from '../Wonders';
import { Production, Research, Unhappiness } from '@civ-clone/civ1-city/Yields';
import { EffectDescription } from '@civ-clone/core-rule/Description';
import Rule from '@civ-clone/core-rule/Rule';
import Yield from '@civ-clone/core-yield/Yield';
import anarchyDuration from '../Rules/Player/anarchy-duration';
import availability from '../Rules/Governments/availability';
import buildingComplete from '../Rules/City/building-complete';
import cityYield from '../Rules/City/yield';
import cost from '../Rules/City/cost';
import { expect } from 'chai';
import pacified from '../Rules/Player/pacified';
import pollutionDivisor from '../Rules/City/pollution-divisor';
import { greatLibraryRules } from '../Rules/Player/research-complete';
import unitYield from '../Rules/Unit/yield';
import yieldModifier from '../Rules/City/yield-modifier';

// What the Wonders say they do, for the Civilopedia (civ-clone/web-renderer#1196), checked against what their rules do
//  where a rule can be run on its own. Each number is one constant that the rule and its description both read.

const describedBy = (rules: Rule[]): [Rule, EffectDescription][] =>
    rules.flatMap((rule) =>
      rule
        .descriptions()
        .map((description): [Rule, EffectDescription] => [rule, description])
    ),
  allRules = (): Rule[] => [
    ...anarchyDuration(),
    ...availability(),
    ...buildingComplete(),
    ...cityYield(),
    ...cost(),
    ...pacified(),
    ...pollutionDivisor(),
    ...greatLibraryRules(),
    ...unitYield(),
    ...yieldModifier(),
  ],
  // Every city has `improvements`, made without a city, as the rules only ask `instanceof`.
  improvements = (...Types: Function[]): any => ({
    getByCity: () => Types.map((Type) => Object.create(Type.prototype)),
  });

describe('descriptions', (): void => {
  it('every Wonder says what it does, bar those whose requirements say it (Manhattan Project, Apollo Program)', (): void => {
    const subjects = new Set(
      describedBy(allRules()).map(([, description]) => description.subject)
    );

    expect(
      Object.values(Wonders)
        .filter((WonderType) => !subjects.has(WonderType))
        .map((WonderType) => WonderType.name)
    ).to.eql(['ApolloProgram', 'ManhattanProject']);
  });

  it('each science or shield Wonder adds the share it says it does', (): void => {
    const {
        CopernicusObservatory,
        HooverDam,
        IsaacNewtonsCollege,
        SetiProgram,
      } = Wonders,
      {
        Library,
      } = require('@civ-clone/civ1-city-improvement/CityImprovements'),
      {
        Factory,
      } = require('@civ-clone/civ1-city-improvement/CityImprovements'),
      rules = yieldModifier(
        undefined,
        undefined,
        improvements(Library, Factory)
      ),
      run = (subject: Function, total: Yield[], base: Yield[]) => {
        const [[rule, description]] = describedBy(rules).filter(
          ([, description]) => description.subject === subject
        );

        return [
          (rule.process({} as any, total, base) as Yield).value(),
          description.value as number,
        ];
      };

    // Newton's adds a third of the base for the one Library.
    const [newton, newtonShare] = run(
      IsaacNewtonsCollege,
      [new Research(60)],
      [new Research(30)]
    );

    expect(newton).to.equal(Math.floor(30 * newtonShare));

    const [hoover, hooverShare] = run(
      HooverDam,
      [new Production(60)],
      [new Production(30)]
    );

    expect(hoover).to.equal(Math.floor(30 * hooverShare));

    const [copernicus, copernicusShare] = run(
      CopernicusObservatory,
      [new Research(60)],
      [new Research(30)]
    );

    expect(copernicus).to.equal(60 * copernicusShare);

    const [seti, setiShare] = run(
      SetiProgram,
      [new Research(60)],
      [new Research(30)]
    );

    expect(seti).to.equal(Math.floor(60 * setiShare));
  });

  it('each content Wonder makes as many content as it says it does', (): void => {
    const { JsBachsCathedral, MichelangelosChapel, Oracle, WomensSuffrage } =
        Wonders,
      described = describedBy(cost());

    [Oracle, JsBachsCathedral, MichelangelosChapel].forEach((WonderType) =>
      described
        .filter(([, description]) => description.subject === WonderType)
        .forEach(([rule, description]): void => {
          const result = rule.process({} as any, [
            new Unhappiness(10),
          ]) as Yield;

          expect(-result.value(), WonderType.name).to.equal(description.value);
        })
    );

    const [[suffrage, description]] = described.filter(
        ([, description]) => description.subject === WomensSuffrage
      ),
      {
        MilitaryUnhappiness,
      } = require('@civ-clone/civ1-city-happiness/Yields'),
      [result] = suffrage.process({} as any, [
        new MilitaryUnhappiness(1, { id: () => 'unit' } as any),
      ]) as Yield[];

    expect(-result.value()).to.equal(description.value);
  });

  it('Hoover Dam divides pollution, and the ship Wonders add moves, as they say', (): void => {
    describedBy(pollutionDivisor()).forEach(([rule, description]): void =>
      expect(rule.process({} as any)).to.equal(description.value)
    );

    describedBy(unitYield()).forEach(([rule, description]): void => {
      const { Movement } = require('@civ-clone/core-unit/Yields'),
        movement = new Movement(1);

      rule.process({} as any, movement);

      expect(movement.value()).to.equal(1 + (description.value as number));
    });
  });
});
