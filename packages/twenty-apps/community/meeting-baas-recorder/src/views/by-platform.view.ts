import { defineView } from 'twenty-sdk';
import { ViewType } from 'twenty-shared/types';
import {
  RECORDING_UNIVERSAL_IDENTIFIER,
  PLATFORM_FIELD_ID,
} from '../objects/recording';

export default defineView({
  universalIdentifier: 'c8f0b6fa-dc35-5adb-83c8-11749702025e',
  name: 'By Platform',
  objectUniversalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 2,
  mainGroupByFieldMetadataUniversalIdentifier: PLATFORM_FIELD_ID,
  groups: [
    { universalIdentifier: 'd7cc1b3a-d079-54e9-a853-01bbe9306fab', fieldValue: 'GOOGLE_MEET', isVisible: true, position: 0 },
    { universalIdentifier: '708b2535-067b-5247-b9ef-09c5d80e6cff', fieldValue: 'ZOOM', isVisible: true, position: 1 },
    { universalIdentifier: 'a732280e-da0a-59ae-8421-86909b7e367f', fieldValue: 'MICROSOFT_TEAMS', isVisible: true, position: 2 },
    { universalIdentifier: 'e49d6c58-790b-5da3-b2d7-5f0dc641970c', fieldValue: 'UNKNOWN', isVisible: true, position: 3 },
  ],
  fields: [
    { universalIdentifier: '1a38ccfd-71e3-59d5-8d50-94fc1c9d25ef', fieldMetadataUniversalIdentifier: PLATFORM_FIELD_ID, position: 0, isVisible: true, size: 150 },
  ],
});
