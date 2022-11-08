import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import Obsolete from '@civ-clone/core-wonder/Rules/Obsolete';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (engine?: Engine) => Obsolete[] = (
  engine: Engine = engineInstance
): Obsolete[] => [
  new Obsolete(
    new Effect((wonder: Wonder, city: City) => {
      engine.emit('wonder:obsolete', wonder, city);
    })
  ),
];

export default getRules;
