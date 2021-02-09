import {
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  Lighthouse,
  MagellansExpedition,
  Oracle,
  Pyramids,
} from './Wonders';
import { instance as availableCityBuildItemsRegistryInstance } from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';

availableCityBuildItemsRegistryInstance.register(
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  Lighthouse,
  MagellansExpedition,
  Oracle,
  Pyramids
);
