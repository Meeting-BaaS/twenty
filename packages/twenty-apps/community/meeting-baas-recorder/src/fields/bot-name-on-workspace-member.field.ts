import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';

export const BOT_NAME_FIELD_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export default defineField({
  universalIdentifier: BOT_NAME_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.TEXT,
  name: 'botName',
  label: 'Bot Name',
  icon: 'IconRobot',
  description: 'Name displayed for the recording bot when it joins meetings',
  defaultValue: "'Twenty CRM Recorder'",
});
