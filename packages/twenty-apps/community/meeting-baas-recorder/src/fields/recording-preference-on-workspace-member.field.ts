import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';

export const RECORDING_PREFERENCE_FIELD_ID = '082e8dd7-a365-5b6b-8d9b-1780f36154b3';

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
      id: 'dd08b14a-c5f2-5eb6-9b4b-e579437a4f6f',
      color: 'green',
      label: 'Record All',
      value: 'RECORD_ALL',
      position: 1,
    },
    {
      id: 'e880d3db-9b3b-58c2-af65-a8e0be61083d',
      color: 'yellow',
      label: 'Organizer Only',
      value: 'RECORD_ORGANIZED',
      position: 2,
    },
    {
      id: 'e9c62cd0-26ab-5241-811d-545a9d0180a6',
      color: 'gray',
      label: 'None',
      value: 'RECORD_NONE',
      position: 3,
    },
  ],
});
