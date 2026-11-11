# civ1-wonder

A collection of `Rule`s to handle the cost and effects of `Wonder`s in-line with Civ 1.

## The Great Wall and the United Nations

As in v474.05, the Great Wall pacifies every other leader towards its owner (in a parley, and when two computer players
meet), and the United Nations only a computer player's leader towards a human owner: between computer players it does
nothing. "Human" is every seat not played by the computer (`civ1-difficulty`'s `isHuman`). `civ1-enhanced` can have
the United Nations act between computer players too (civ-clone/web-renderer#960). The ids are exported from
`RuleIds.ts`.

## TODO

Implement all the missing benefits:

- `ManhattanProject`
