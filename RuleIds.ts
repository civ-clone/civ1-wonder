// The ids of this package's rules that another package is expected to name (civ-clone/web-renderer#954): a set that
//  supersedes one, or a host that switches or describes it. Imported, a rename breaks the other package's build.

/** Every other leader is pacified towards the Great Wall's owner, until anyone discovers Gunpowder. */
export const GREAT_WALL_PACIFIED_RULE =
  'civ1-wonder:player/pacified/great-wall';

/** A computer player's leader is pacified towards the human, when the human owns the United Nations. */
export const UNITED_NATIONS_PACIFIED_RULE =
  'civ1-wonder:player/pacified/united-nations';
