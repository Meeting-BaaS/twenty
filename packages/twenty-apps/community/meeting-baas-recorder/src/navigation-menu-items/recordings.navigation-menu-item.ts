import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk';
import { RECORDING_UNIVERSAL_IDENTIFIER } from '../objects/recording';

export default defineNavigationMenuItem({
  universalIdentifier: '6e7bbaa0-d46f-5701-ae91-7346afcb936c',
  position: 0,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
});
