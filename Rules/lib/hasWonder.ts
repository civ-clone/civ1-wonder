// Wonder ownership is base-wonder's: these are the same functions, kept at this path for what imports them. Obsolete
//  Wonders still exist, but no longer do anything. Nor does one whose city is destroyed, should it still be in
//  `wonders` (`isStanding`, civ-clone/web-renderer#975).
export {
  cityHasWonder,
  playerHasWonder,
  playerOwnsWonder,
} from '@civ-clone/base-wonder/lib/hasWonder';
