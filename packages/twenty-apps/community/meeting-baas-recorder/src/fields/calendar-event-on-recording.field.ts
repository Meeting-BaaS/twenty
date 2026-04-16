import {
  defineField,
  FieldType,
  RelationType,
  OnDeleteAction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';
import { RECORDING_UNIVERSAL_IDENTIFIER } from '../objects/recording';

export const CALENDAR_EVENT_ON_RECORDING_ID = 'f41b7906-5667-5241-a269-b8140dcfdb53';
export const RECORDINGS_ON_CALENDAR_EVENT_ID = 'b78cc9fb-d758-5308-a37b-4b4a60a6870b';

export default defineField({
  universalIdentifier: CALENDAR_EVENT_ON_RECORDING_ID,
  objectUniversalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'calendarEvent',
  label: 'Calendar Event',
  icon: 'IconCalendarEvent',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEvent.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: RECORDINGS_ON_CALENDAR_EVENT_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'calendarEventId',
  },
});
