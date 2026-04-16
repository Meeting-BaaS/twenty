import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';

export const BOT_ENTRY_MESSAGE_FIELD_ID = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

export default defineField({
  universalIdentifier: BOT_ENTRY_MESSAGE_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.TEXT,
  name: 'botEntryMessage',
  label: 'Bot Entry Message',
  icon: 'IconMessage',
  description: 'Message the bot posts in the meeting chat when it joins (max 500 characters)',
  defaultValue: "''",
});
