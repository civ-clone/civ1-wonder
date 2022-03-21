import {
  Automobile,
  Communism,
  Electricity,
  Electronics,
  Gunpowder,
  Invention,
  Magnetism,
  NuclearFission,
  Religion,
  University,
} from '@civ-clone/civ1-science/Advances';
import {
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  IsaacNewtonsCollege,
  Lighthouse,
  MichelangelosChapel,
  Oracle,
  Pyramids,
  ShakespearesTheatre,
} from '../../Wonders';
import {
  Obsolete,
  IObsoleteRegistry,
} from '@civ-clone/core-wonder/Rules/Obsolete';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Complete from '@civ-clone/core-science/Rules/Complete';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  ruleRegistry?: RuleRegistry,
  wonderRegistry?: WonderRegistry
) => Complete[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Complete[] => [
  new Complete(
    new Criterion((): boolean =>
      wonderRegistry.some(
        (wonder: Wonder): boolean => wonder instanceof GreatLibrary
      )
    ),
    new Criterion(
      (playerResearch: PlayerResearch, completedResearch: Advance): boolean =>
        playerResearchRegistry.filter(
          (playerResearch: PlayerResearch): boolean =>
            playerResearch.completed(
              completedResearch.constructor as typeof Advance
            )
        ).length >= 3
    ),
    new Criterion(
      (playerResearch: PlayerResearch, completedResearch: Advance): boolean => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder: Wonder): boolean => wonder instanceof GreatLibrary)
            .map((greatLibrary: GreatLibrary): Player => greatLibrary.player()),
          owningPlayerResearch =
            playerResearchRegistry.getByPlayer(owningPlayer);

        return !owningPlayerResearch.completed(
          completedResearch.constructor as typeof Advance
        );
      }
    ),
    new Effect(
      (playerResearch: PlayerResearch, completedResearch: Advance): void => {
        const [owningPlayer] = wonderRegistry
            .filter((wonder: Wonder): boolean => wonder instanceof GreatLibrary)
            .map((greatLibrary: GreatLibrary): Player => greatLibrary.player()),
          owningPlayerResearch =
            playerResearchRegistry.getByPlayer(owningPlayer);

        return owningPlayerResearch.addAdvance(
          completedResearch.constructor as typeof Advance
        );
      }
    )
  ),

  ...(
    [
      [Colossus, Electricity],
      [CopernicusObservatory, Automobile],
      [GreatLibrary, University],
      [GreatWall, Gunpowder],
      [HangingGardens, Invention],
      [IsaacNewtonsCollege, NuclearFission],
      [Lighthouse, Magnetism],
      [MichelangelosChapel, Communism],
      [Oracle, Religion],
      [Pyramids, Communism],
      [ShakespearesTheatre, Electronics],
    ] as [typeof Wonder, typeof Advance][]
  ).map(
    ([WonderType, ObsoletingAdvance]: [
      typeof Wonder,
      typeof Advance
    ]): Complete =>
      new Complete(
        new Criterion(() =>
          wonderRegistry
            .entries()
            .some((wonder: Wonder) => wonder instanceof WonderType)
        ),
        new Criterion(
          (playerResearch: PlayerResearch, advance: Advance) =>
            advance instanceof ObsoletingAdvance
        ),
        new Effect(() => {
          const [wonder] = wonderRegistry
            .filter((wonder: Wonder) => wonder instanceof WonderType);

          (ruleRegistry as IObsoleteRegistry).process(
            Obsolete,
            wonder,
            wonder.city()
          );
        })
      )
  ),
];

export default getRules;
