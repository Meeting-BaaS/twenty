import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';

export const RECORDING_PREFERENCE_FIELD_ID = 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a';

export default defineField({
  universalIdentifier: RECORDING_PREFERENCE_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.SELECT,
  name: 'recordingPreference',
  label: 'Recording Preference',
  icon: 'IconVideo',
  description: 'Controls automatic meeting recording behavior for this workspace member',
  defaultValue: "'RECORD_NONE'",
  options: [
    {
      id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
      color: 'green',
      label: 'Record All',
      value: 'RECORD_ALL',
      position: 1,
    },
    {
      id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
      color: 'yellow',
      label: 'Organizer Only',
      value: 'RECORD_ORGANIZED',
      position: 2,
    },
    {
      id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
      color: 'gray',
      label: 'None',
      value: 'RECORD_NONE',
      position: 3,
    },
  ],
});
